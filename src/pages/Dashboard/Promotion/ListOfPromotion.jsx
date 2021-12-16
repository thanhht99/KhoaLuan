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
  Divider,
  Button,
} from "antd";
import { doNotGetData } from "../../../constants/doNotGetData";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { ReloadOutlined } from "@ant-design/icons";
import { insertPromotionAll } from "../../../store/reducers/promotionAll";
import {
  getAllPromotions,
  updateActivePromotion,
} from "../../../api/promotion";
import { insertPromotion } from "../../../store/reducers/promotionDetail";
import { AddPromotion } from "./AddPromotion";
import { getCategory } from "../../../api/category";
import { getProductIsActiveTrueAndIsPromotionFalse } from "../../../api/product";
import { insertProductAllTrue } from "../../../store/reducers/productAllTrue";
import { insertCategory } from "../../../store/reducers/categoryAll";
import { DrawerPromotion } from "./DrawerPromotion";
import { ExportReactCSV } from "../../../constants/ExportReactCSV ";

const ListOfPromotion = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxPromotion = useSelector((state) => state.promotionAll.Promotion);
  const initialState = {
    promotions: reduxPromotion,
    promotion: null,
    drawerVisible: false,
    total: null,
  };
  const [state, setState] = useState(initialState);
  const token = Cookies.get("token");

  const fetchData = async () => {
    const re_promotion = await getAllPromotions(token);
    if (!re_promotion) {
      doNotGetData();
    }
    if (re_promotion) {
      if (re_promotion.success) {
        const keyPromotion = re_promotion.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertPromotionAll({ newPromotion: keyPromotion }));
        setState((prev) => ({
          ...prev,
          promotions: keyPromotion,
        }));
      }
      if (!re_promotion.success) {
        if (re_promotion.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: get all promotions",
            description: `${re_promotion.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        } else {
          notification["warning"]({
            message: "Warning: get all promotions",
            description: `${re_promotion.message}.`,
          });
        }
      }
    }
  };

  const fetchDataAddPromotion = async () => {
    const re_category = await getCategory();
    const re_product = await getProductIsActiveTrueAndIsPromotionFalse();
    if (!re_category || !re_product) {
      doNotGetData();
    }
    if (re_category && re_product) {
      if (re_category.success && re_product.success) {
        const newProduct = re_product.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        const newCategory = re_category.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertProductAllTrue({ newProduct }));
        dispatch(insertCategory({ newCategory }));
      }
      if (!re_category.success || !re_product.success) {
        notification["warning"]({
          message: "Warning",
          description: `${re_category.message}.\n ${re_product.message}.`,
        });
      }
    }
  };

  useEffect(() => {
    if (
      reduxPromotion.length === 0 ||
      state.promotions.length !== reduxPromotion.length
    ) {
      fetchData();
    }
  });

  const onClickPromotion = (record) => {
    // console.log("🚀🚀🚀🚀🚀🚀 ~ record", record);
    setState((prev) => ({
      ...prev,
      promotion: record,
      drawerVisible: true,
    }));
    dispatch(insertPromotion({ newPromotion: record }));
  };

  const confirm = async (record) => {
    // console.log("🚀🚀🚀🚀🚀🚀 ~ record", record);

    const res = await updateActivePromotion(
      record._id,
      !record.isActive,
      token
    );

    if (res && res.success) {
      fetchData();
      fetchDataAddPromotion();
      notification["success"]({
        message: "Update status of the Promotion",
        description: "Update status of the Promotion successfully",
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update status of the Promotion",
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
          message: "Update status of the Promotion",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update status of the Promotion",
          description: `${res.message}`,
        });
      }
    }
  };

  const columns = [
    {
      title: "Promotion",
      dataIndex: "promotion_name",
      width: "25%",
      ...getColumnSearchProps("promotion_name"),
      render: (promotion_name, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={promotion_name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record._id}
            onClick={() => onClickPromotion(record)}
          >
            {promotion_name}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      width: "20%",
      ...getColumnSearchProps("startDate"),
      defaultSortOrder: "descend",
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      width: "20%",
      ...getColumnSearchProps("endDate"),
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "10%",
      filters: [
        {
          text: "Percent",
          value: "Percent",
        },
        {
          text: "Money",
          value: "Money",
        },
      ],
      onFilter: (value, record) => {
        return record.type.indexOf(value) === 0;
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
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
    setState((prev) => ({
      ...prev,
      drawerVisible: false,
    }));
    fetchData();
  };

  const refresh = () => {
    fetchData();
    fetchDataAddPromotion();
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
        className={"btn-Reload-Page-List-Of-Promotions"}
      >
        Reload Page
      </Button>

      <ExportReactCSV csvData={state.promotions} fileName="List of promotions" />
      <Divider />
      <AddPromotion />
      <Table
        columns={columns}
        dataSource={state.promotions}
        footer={() => {
          const total =
            state.total || state.total === 0
              ? state.total
              : state.promotions.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />
      {state.promotion && (
        <Drawer
          title={state.promotion.promotion_name}
          width={520}
          onClose={onClose}
          visible={state.drawerVisible}
          className={"drawer-promotion-dashboard"}
        >
          <DrawerPromotion
            id={state.promotion._id}
            promotion={state.promotion}
            drawerVisible={state.drawerVisible}
          />
        </Drawer>
      )}
    </>
  );
};

export { ListOfPromotion };
