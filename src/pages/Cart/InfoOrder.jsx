import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { validateMessages } from "../../constants/validateMessages";
import { Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addInfoOrder } from "../../store/reducers/infoOrder";
import Cookies from "js-cookie";

const { Option } = Select;

const InfoOrder = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const reduxInfoOrder = useSelector((state) => state.infoOrder.InfoOrder);
  const token = Cookies.get("token");
  const reduxUser = useSelector((state) => state.user.User);
  const reduxAcc = useSelector((state) => state.acc.Acc);

  // console.log("🗯.🗯.🗯.🗯.🗯. reduxInfoOrder", reduxInfoOrder);
  // console.log("💦💦💦💦💦💦 YES");

  const [state, setState] = useState({
    infoOrder: reduxInfoOrder,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, infoOrder: reduxInfoOrder }));
    if (reduxAcc.id && !reduxInfoOrder.email) {
      const infoOrder = {
        address: reduxUser.address,
        email: reduxUser.email,
        fullName: reduxUser.fullName,
        phone: reduxUser.phone,
        note: null,
        voucherCode: null,
        isError: true,
      };
      dispatch(addInfoOrder({ infoOrder }));
    }
  }, [reduxInfoOrder, reduxUser, reduxAcc, dispatch]);

  const onChange = () => {
    const formValues = form.getFieldsValue();
    let infoOrder = {
      address: formValues.Address,
      email: formValues.Email,
      fullName: formValues.FullName,
      phone: formValues.Phone,
      note: formValues.note,
      voucherCode: formValues.voucher,
      isError: true,
      isError2: true,
    };
    if (
      form.isFieldTouched("FullName") &&
      form.isFieldTouched("Email") &&
      form.isFieldTouched("Phone") &&
      form.isFieldTouched("Address")
    ) {
      if (!form.getFieldsError().filter(({ errors }) => errors.length).length) {
        infoOrder.isError = false;
        dispatch(addInfoOrder({ infoOrder }));
      } else {
        dispatch(addInfoOrder({ infoOrder }));
      }
    } else if (
      !form.getFieldsError().filter(({ errors }) => errors.length).length
    ) {
      infoOrder.isError = false;
      dispatch(addInfoOrder({ infoOrder }));
    } else {
      dispatch(addInfoOrder({ infoOrder }));
    }
  };

  const prefixSelectorPhone = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div style={{ paddingTop: "25px" }}>
      <Form
        form={form}
        onChange={onChange}
        className={"my-form-info-order"}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 12,
        }}
        validateMessages={validateMessages}
        fields={[
          {
            name: ["FullName"],
            value: state.infoOrder.fullName,
          },
          {
            name: ["Email"],
            value: state.infoOrder.email,
          },
          {
            name: ["note"],
            value: state.infoOrder.note,
          },
          {
            name: ["Phone"],
            value: state.infoOrder.phone,
          },
          {
            name: ["Address"],
            value: state.infoOrder.address,
          },
          {
            name: ["voucher"],
            value: state.infoOrder.voucherCode,
          },
        ]}
        initialValues={{
          prefix: "84",
        }}
      >
        <Form.Item
          label={<span style={{ color: "black" }}>Full Name</span>}
          name="FullName"
          rules={[
            {
              required: true,
              type: "string",
              min: 3,
              max: 50,
            },
          ]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "black" }}>Email</span>}
          name="Email"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          {token ? (
            <Input placeholder="Email" disabled />
          ) : (
            <Input placeholder="Email" />
          )}
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "black" }}>Phone</span>}
          name="Phone"
          rules={[
            {
              required: true,
            },
            () => ({
              validator(_, value) {
                const phone = "0" + value;
                if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("This is not a valid phone number!")
                );
              },
            }),
          ]}
        >
          <Input
            addonBefore={prefixSelectorPhone}
            placeholder="Phone"
            type="text"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "black" }}>Address</span>}
          name="Address"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea placeholder="Address" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "black", fontSize: "17px" }}>Note</span>}
          name="note"
        >
          <Input.TextArea placeholder="Note" />
        </Form.Item>

        <Form.Item
          label={
            <span style={{ color: "black", fontSize: "17px" }}>Voucher</span>
          }
          name="voucher"
          rules={[
            {
              type: "string",
              min: 8,
              max: 8,
            },
          ]}
        >
          <Input placeholder="Voucher" />
        </Form.Item>
      </Form>
    </div>
  );
};

export { InfoOrder };
