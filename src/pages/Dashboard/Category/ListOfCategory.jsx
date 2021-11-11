import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Switch,
  Tooltip,
  Button,
  Table,
  Space,
  notification,
  Drawer,
  Popconfirm,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
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

const ListOfCategory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxCategoryTAF = useSelector((state) => state.categoryTAF.Category);
  const initialState = {
    categories: reduxCategoryTAF,
    category: null,
    searchText: "",
    searchedColumn: "",
    drawerVisible: false,
  };
  const [state, setState] = useState(initialState);
  const token = Cookies.get("token");

  let searchInput = React.createRef();

  useEffect(() => {
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
    // console.log("🚀🚀🚀🚀🚀 ~ reduxCategoryTAF", reduxCategoryTAF);
    if (
      reduxCategoryTAF.length === 0 ||
      state.categories.length !== reduxCategoryTAF.length
    ) {
      fetchData();
    }
  }, [reduxCategoryTAF, state.categories.length, token, history, dispatch]);

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

  const onClickCategory = (record) => {
    // console.log("✅✅✅ Hello World", record);
    setState((prev) => ({
      ...prev,
      category: record,
      drawerVisible: true,
    }));
    dispatch(insertCategoryDetail({ newCategory: record }));
  };

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
      onFilter: (value, record) => {
        return record.isActive.indexOf(value) === 0;
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

  return (
    <>
      <AddCategory />
      <Table columns={columns} dataSource={state.categories} />
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
