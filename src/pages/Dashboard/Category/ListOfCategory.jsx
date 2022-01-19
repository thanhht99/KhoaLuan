import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Switch,
  Tooltip,
  Table,
  notification,
  Drawer,
  Popconfirm,
  Button,
  Divider,
} from "antd";
import { doNotGetData } from "../../../constants/doNotGetData";
import {
  getAllCategoryTrueAndFalse,
  getCategory,
  updateActiveCategory,
} from "../../../api/category";
import { AddCategory } from "./AddCategory";
import { insertCategoryTAF } from "../../../store/reducers/categoryTrueAndFalse";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { DrawerCategory } from "./DrawerCategory";
import { insertCategoryDetail } from "../../../store/reducers/categoryDetail";
import { insertCategory } from "../../../store/reducers/categoryAll";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { ReloadOutlined } from "@ant-design/icons";
import { ExportReactCSV } from "../../../constants/ExportReactCSV ";

const ListOfCategory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxCategoryTAF = useSelector((state) => state.categoryTAF.Category);
  const initialState = {
    categories: reduxCategoryTAF,
    category: null,
    drawerVisible: false,
    total: null,
  };
  const [state, setState] = useState(initialState);
  const token = Cookies.get("token");

  const fetchData = async () => {
    const re_category = await getAllCategoryTrueAndFalse(token);
    if (!re_category) {
      doNotGetData();
    }
    if (re_category) {
      if (re_category.success) {
        const keyCategory = re_category.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertCategoryTAF({ newCategory: keyCategory }));
        setState((prev) => ({
          ...prev,
          categories: keyCategory,
        }));
      }
      if (!re_category.success) {
        if (re_category.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${re_category.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        } else {
          notification["warning"]({
            message: "Warning",
            description: `${re_category.message}.`,
          });
        }
      }
    }
  };

  useEffect(() => {
    // console.log("🚀🚀🚀🚀🚀 ~ reduxCategoryTAF", reduxCategoryTAF);
    if (
      reduxCategoryTAF.length === 0 ||
      state.categories.length !== reduxCategoryTAF.length
    ) {
      fetchData();
    }
  });

  const onClickCategory = (record) => {
    // console.log("✅✅✅ Hello World", record);
    setState((prev) => ({
      ...prev,
      category: record,
      drawerVisible: true,
    }));
    dispatch(insertCategoryDetail({ newCategory: record }));
  };

  const confirm = async (record) => {
    // console.log("🚀 ~ 🚀 ~ 🚀 confirm ~ record", record);
    const res = await updateActiveCategory(record._id, !record.isActive, token);

    if (res && res.success) {
      const re_category = await getAllCategoryTrueAndFalse(token);
      const keyCategory = re_category.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertCategoryTAF({ newCategory: keyCategory }));

      // Update redux category isActive=true
      const categoryTrue = await getCategory();
      const categoryTrueKey = categoryTrue.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertCategory({ newCategory: categoryTrueKey }));

      setState((prev) => ({
        ...prev,
        categories: keyCategory,
      }));

      notification["success"]({
        message: "Update status of the category",
        description: "Update status of the category successfully",
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update status of the category",
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
          message: "Update status of the category",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update status of the category",
          description: `${res.message}`,
        });
      }
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category_name",
      width: "40%",
      ...getColumnSearchProps("category_name"),
      render: (category_name, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={category_name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record._id}
            onClick={() => onClickCategory(record)}
          >
            {category_name}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "category_desc",
      width: "40%",
      ...getColumnSearchProps("category_desc"),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      width: "20%",
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
      defaultFilteredValue: ["true"],
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
    const re_category = await getAllCategoryTrueAndFalse(token);
    const keyCategory = re_category.data.map((item, index) => {
      const key = index;
      return { ...item, key };
    });
    dispatch(insertCategoryTAF({ newCategory: keyCategory }));

    // Update redux category isActive=true
    const categoryTrue = await getCategory();
    const categoryTrueKey = categoryTrue.data.map((item, index) => {
      const key = index;
      return { ...item, key };
    });
    dispatch(insertCategory({ newCategory: categoryTrueKey }));

    setState((prev) => ({
      ...prev,
      categories: keyCategory,
      drawerVisible: false,
    }));
  };

  const refresh = () => {
    fetchData();
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
        className={"btn-Reload-Page-List-Of-Vouchers"}
      >
        Reload Page
      </Button>

      <ExportReactCSV csvData={state.categories} fileName="List of categories" />
      <Divider />
      <AddCategory />
      <Table
        columns={columns}
        dataSource={state.categories}
        footer={() => {
          const total =
            state.total || state.total === 0
              ? state.total
              : state.categories.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          // console.log("extra.currentDataSource", extra);
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />
      {state.category && (
        <Drawer
          title={state.category.category_name}
          width={520}
          onClose={onClose}
          visible={state.drawerVisible}
          className={"drawer-category-dashboard"}
        >
          <DrawerCategory id={state.category._id} />
        </Drawer>
      )}
    </>
  );
};

export { ListOfCategory };
