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
import { insertVoucherAll } from "../../../store/reducers/voucherAll";
import { insertVoucher } from "../../../store/reducers/voucherDetail";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { getAllVouchers, updateActiveVoucher } from "../../../api/voucher";
import { ReloadOutlined } from "@ant-design/icons";
import { AddVoucher } from "./AddVoucher";
import { DrawerVoucher } from "./DrawerVoucher";
import { ExportReactCSV } from "../../../constants/ExportReactCSV ";

const ListOfVoucher = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxVoucher = useSelector((state) => state.voucherAll.Voucher);
  const initialState = {
    vouchers: reduxVoucher,
    voucher: null,
    drawerVisible: false,
    total: null,
  };
  const [state, setState] = useState(initialState);
  const token = Cookies.get("token");

  const fetchData = async () => {
    const re_voucher = await getAllVouchers(token);
    if (!re_voucher) {
      doNotGetData();
    }
    if (re_voucher) {
      if (re_voucher.success) {
        const keyVoucher = re_voucher.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertVoucherAll({ newVoucher: keyVoucher }));
        setState((prev) => ({
          ...prev,
          vouchers: keyVoucher,
        }));
      }
      if (!re_voucher.success) {
        if (re_voucher.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: get all voucher",
            description: `${re_voucher.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        } else {
          notification["warning"]({
            message: "Warning: get all voucher",
            description: `${re_voucher.message}.`,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (
      reduxVoucher.length === 0 ||
      state.vouchers.length !== reduxVoucher.length
    ) {
      fetchData();
    }
  });

  const onClickVoucher = (record) => {
    setState((prev) => ({
      ...prev,
      voucher: record,
      drawerVisible: true,
    }));
    dispatch(insertVoucher({ newVoucher: record }));
  };

  const confirm = async (record) => {
    const res = await updateActiveVoucher(record._id, !record.isActive, token);

    if (res && res.success) {
      const re_voucher = await getAllVouchers(token);
      const keyVoucher = re_voucher.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertVoucherAll({ newVoucher: keyVoucher }));

      setState((prev) => ({
        ...prev,
        vouchers: keyVoucher,
      }));

      notification["success"]({
        message: "Update status of the vouchers",
        description: "Update status of the vouchers successfully",
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update status of the voucher",
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
          message: "Update status of the voucher",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update status of the voucher",
          description: `${res.message}`,
        });
      }
    }
  };

  const columns = [
    {
      title: "Voucher",
      dataIndex: "voucher_name",
      width: "25%",
      ...getColumnSearchProps("voucher_name"),
      render: (voucher_name, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={voucher_name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record._id}
            onClick={() => onClickVoucher(record)}
          >
            {voucher_name}
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
      title: "Code",
      dataIndex: "code",
      width: "10%",
      ...getColumnSearchProps("code"),
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
    const re_voucher = await getAllVouchers(token);
    const keyVoucher = re_voucher.data.map((item, index) => {
      const key = index;
      return { ...item, key };
    });
    dispatch(insertVoucherAll({ newVoucher: keyVoucher }));

    setState((prev) => ({
      ...prev,
      vouchers: keyVoucher,
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

      <ExportReactCSV csvData={state.vouchers} fileName="List of vouchers" />
      <Divider />
      <AddVoucher />
      <Table
        columns={columns}
        dataSource={state.vouchers}
        footer={() => {
          const total =
            state.total || state.total === 0
              ? state.total
              : state.vouchers.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />
      {state.voucher && (
        <Drawer
          title={state.voucher.voucher_name}
          width={520}
          onClose={onClose}
          visible={state.drawerVisible}
          className={"drawer-voucher-dashboard"}
        >
          <DrawerVoucher
            id={state.voucher._id}
            voucher={state.voucher}
            drawerVisible={state.drawerVisible}
          />
        </Drawer>
      )}
    </>
  );
};

export { ListOfVoucher };
