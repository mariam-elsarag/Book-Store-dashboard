import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axiosInstance from "../../axiosInstance";
import { MdOutlineDelete } from "react-icons/md";
import Table from "../../Ui/Table";
const columns = ["bookTitle", "price", "paid", "userFullName"];
const headerColumns = ["Book Title", "price", "status", "full_name"];
const OrderContainer = () => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(`/api/order/?page=1`);
  const [previous, setpreviouse] = useState(null);

  // delete order
  const [deleteLoader, setDeleteLoader] = useState(false);

  const getOrders = async (endpoint) => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (next || previous || endpoint) {
      try {
        setLoading(true);
        const Endpoint = endpoint ? endpoint : next;

        const response = await axiosInstance.get(Endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });
        const fetchedData = await response.data.results;

        const formattedData = fetchedData.map((order) => ({
          bookTitle: order.book.title,
          userFullName: order.user.full_name,
          paid: order.paid,
          price: order.price,
          id: order._id,
        }));

        setData(formattedData);

        setNext(response.data.next);
        setpreviouse(response.data.prev);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDelete = async (id) => {
    try {
      setDeleteLoader(true);

      const response = await axiosInstance.delete(`/api/order/${id}`);
      if (response.status === 204) {
        getOrders(`/api/order/?page=1`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoader(false);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);
  const actionList = [
    {
      id: 0,
      icon: <MdOutlineDelete size={18} color="var(--natural-light)" />,
      action: (item) => handleDelete(item.id),
    },
  ];
  const renderColumn = {
    paid: (value) => {
      return (
        <span
          className={`px-2 py-1 rounded  text-xs ${
            value
              ? "bg-primary-100 text-primary-600 "
              : "text-error bg-error/10"
          }`}
        >
          {value ? "True" : "False"}
        </span>
      );
    },
  };

  return (
    <div>
      <Table
        headerColumns={headerColumns}
        columns={columns}
        data={data}
        actionList={actionList}
        renderColumn={renderColumn}
        headerClassName="min-w-[150px]"
      />
    </div>
  );
};

export default OrderContainer;
