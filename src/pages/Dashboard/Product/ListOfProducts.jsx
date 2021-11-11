import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Table,
  Tooltip,
  notification,
  Switch,
  Input,
  Drawer,
  Divider,
  Space,
  Button,
} from "antd";
import { getCategory } from "../../../api/category";
import { doNotGetData } from "../../../constants/doNotGetData";
import { getProducts } from "../../../api/product";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { AddProduct } from "./AddProduct";
import { DrawerProduct } from "./DrawerProduct";
import { useDispatch, useSelector } from "react-redux";
import { insertProduct } from "../../../store/reducers/productDetail";
import { insertCategory } from "../../../store/reducers/categoryAll";
import { insertProductAll } from "../../../store/reducers/productAll";

const ListOfProducts = () => {
  const dispatch = useDispatch();
  const reduxProductAll = useSelector((state) => state.productAll.Product);
  const reduxCategoryAll = useSelector((state) => state.categoryAll.Category);
  const initialState = {
    products: reduxProductAll,
    product: null,
    categories: reduxCategoryAll,
    searchText: "",
    searchedColumn: "",
    drawerVisible: false,
    imageUrl: "", //1
    fileList: [], //1
  };

  const [state, setState] = useState(initialState);

  let searchInput = React.createRef();

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setState((prev) => ({
                ...prev,
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              }));
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState((prev) => ({
      ...prev,
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    }));
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState((prev) => ({
      ...prev,
      searchText: "",
    }));
  };

  const onClickProduct = (record) => {
    // console.log("🚀 🚀 🚀 Hello World", record);
    setState((prev) => ({
      ...prev,
      product: record,
      drawerVisible: true,
    }));
    dispatch(insertProduct({ newProduct: record }));
  };

  const onChangeSwitch = (e) => {
    console.log("🚀 🚀 🚀 🚀 🚀 🚀", e);
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
      title: "Quantity",
      dataIndex: "quantity",
      width: "10%",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "10%",
      filters: filterCategories,
      onFilter: (value, record) => {
        return record.category.indexOf(value) === 0;
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
      width: "10%",
      onFilter: (value, record) => {
        return record.isActive.indexOf(value) === 0;
      },
      render: (isActive) => (
        <div>
          <Switch checked={isActive} onChange={onChangeSwitch} />
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
      <Divider />
      <AddProduct categories={state.categories} />
      <Table columns={columns} dataSource={state.products} />
      {state.product && (
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
