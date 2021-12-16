import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Table,
  Tooltip,
  notification,
  Switch,
  Drawer,
  Divider,
  Button,
  Popconfirm,
} from "antd";
import { getCategory } from "../../../api/category";
import { doNotGetData } from "../../../constants/doNotGetData";
import { getProducts, updateActiveProduct } from "../../../api/product";
import { ReloadOutlined } from "@ant-design/icons";
import { AddProduct } from "./AddProduct";
import { DrawerProduct } from "./DrawerProduct";
import { useDispatch, useSelector } from "react-redux";
import { insertProduct } from "../../../store/reducers/productDetail";
import { insertCategory } from "../../../store/reducers/categoryAll";
import { insertProductAll } from "../../../store/reducers/productAll";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { ExportReactCSV } from "../../../constants/ExportReactCSV ";

const ListOfProducts = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxProductAll = useSelector((state) => state.productAll.Product);
  const reduxCategoryAll = useSelector((state) => state.categoryAll.Category);
  const acc = useSelector((state) => state.acc.Acc);

  const initialState = {
    products: reduxProductAll,
    product: null,
    categories: reduxCategoryAll,
    searchText: "",
    searchedColumn: "",
    drawerVisible: false,
    imageUrl: "", //1
    fileList: [], //1
    total: null,
  };
  const token = Cookies.get("token");

  const [state, setState] = useState(initialState);

  const refresh = () => {
    setState({ ...initialState });
  };

  const filterCategories = state.categories.map((item) => {
    const value = {
      text: item.category_name,
      value: item.category_name,
    };
    return value;
  });

  // console.log("🚀🚀🚀🚀🚀 ~ state", state);

  useEffect(() => {
    const fetchData = async () => {
      const re_category = await getCategory();
      const re_product = await getProducts();
      if (!re_category || !re_product) {
        doNotGetData();
      }
      if (re_category && re_product) {
        if (re_category.success && re_product.success) {
          const keyCategory = re_category.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertCategory({ newCategory: keyCategory }));
          const keyProducts = re_product.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertProductAll({ newProduct: keyProducts }));
          setState((prev) => ({
            ...prev,
            products: keyProducts,
            categories: keyCategory,
          }));
        }
        if (!re_category.success || !re_product.success) {
          notification["warning"]({
            message: "Warning",
            description: `${re_category.message}.\n ${re_product.message}.`,
          });
        }
      }
    };
    if (
      reduxProductAll.length === 0 ||
      reduxCategoryAll.length === 0 ||
      state.products.length !== reduxProductAll.length
    ) {
      fetchData();
    }
  }, [dispatch, reduxCategoryAll, reduxProductAll, state.products.length]);

  const onClickProduct = (record) => {
    // console.log("🚀 🚀 🚀 Hello World", record);
    setState((prev) => ({
      ...prev,
      product: record,
      drawerVisible: true,
    }));
    dispatch(insertProduct({ newProduct: record }));
  };

  const confirm = async (record) => {
    const res = await updateActiveProduct(record.sku, !record.isActive, token);

    if (res && res.success) {
      const re_product = await getProducts();
      const keyProducts = re_product.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertProductAll({ newProduct: keyProducts }));
      setState((prev) => ({
        ...prev,
        products: keyProducts,
      }));

      notification["success"]({
        message: "Update status of the product",
        description: "Update status of the product successfully",
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update status of the product",
          description: `${res.message}`,
        });
        history.push("/account/sign-in/reload");
        window.location.reload();
      }
      if (typeof res.message === "object") {
        const message = Object.keys(res.message).map((key) => {
          return res.message[key];
        });
        notification["warning"]({
          message: "Update status of the product",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update status of the product",
          description: `${res.message}`,
        });
      }
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
      render: (name, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record.sku}
            onClick={() => onClickProduct(record)}
          >
            {name}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: "10%",
      ...getColumnSearchProps("sku"),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "10%",
      align: "center",
      render: (image) => (
        <>
          <img
            src={image}
            style={{ width: "100px", height: "80px", objectFit: "cover" }}
            alt=""
          />
        </>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "10%",
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <div>{price}$</div>,
    },
    {
      title: "Discount",
      dataIndex: ["isPromotion"],
      width: "10%",
      align: "center",
      filters: [
        {
          text: "True",
          value: "true",
        },
        {
          text: "False",
          value: "false",
        },
      ],
      onFilter: (value, record) => {
        return record.isPromotion.toString().indexOf(value) === 0;
      },
      render: (isPromotion, record) => (
        <div style={{ fontWeight: "bold", color: "rgb(255 109 44)" }}>
          {isPromotion ? (
            record.promotion_detail.discount > 1 ? (
              <>{record.promotion_detail.discount}$</>
            ) : (
              <>{record.promotion_detail.discount * 100}%</>
            )
          ) : null}
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "10%",
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "10%",
      align: "center",
      filters: filterCategories,
      onFilter: (value, record) => {
        return record.category.indexOf(value) === 0;
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
      align: "center",
      width: "10%",
      filters: [
        {
          text: "True",
          value: "true",
        },
        {
          text: "False",
          value: "false",
        },
      ],
      onFilter: (value, record) => {
        return record.isActive.toString().indexOf(value) === 0;
      },
      render: (isActive, record) => (
        <div>
          <Popconfirm
            title="Do you want to change the status?"
            onConfirm={() => confirm(record)}
          >
            <Switch checked={isActive} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onClose = async () => {
    const re_product = await getProducts();
    const keyProducts = re_product.data.map((item, index) => {
      const key = index;
      return { ...item, key };
    });
    dispatch(insertProductAll({ newProduct: keyProducts }));
    setState({ ...state, drawerVisible: false, products: keyProducts });
  };

  return (
    <>
      <br />
      <Button
        type="primary"
        size="small"
        onClick={refresh}
        icon={<ReloadOutlined />}
        style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
        className={"btn-Reload-Page-List-Of-Products"}
      >
        Reload Page
      </Button>

      <ExportReactCSV csvData={state.products} fileName="List of products" />
      <Divider />
      {acc && acc.role === "Admin" && (
        <AddProduct categories={state.categories} />
      )}
      <Table
        columns={columns}
        dataSource={state.products}
        footer={() => {
          const total =
            state.total || state.total === 0
              ? state.total
              : state.products.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />
      {state.product && acc && acc.role === "Admin" && (
        <Drawer
          title={state.product.name}
          width={520}
          onClose={onClose}
          visible={state.drawerVisible}
          className={"drawer-product-dashboard"}
        >
          <DrawerProduct
            product={state.product}
            drawerVisible={state.drawerVisible}
          />
        </Drawer>
      )}
    </>
  );
};

export { ListOfProducts };
