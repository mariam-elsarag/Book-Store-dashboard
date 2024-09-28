import React, { useState } from "react";
// lib
// icon
import { FaRegTrashCan } from "react-icons/fa6";
// component
import Model from "./Model";
import Button from "../components/Button";
import axiosInstance from "../axiosInstance";

const ConfirmDelete = ({ open, onClose, deleteLink = "", refetchData }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.delete(deleteLink);
      if (response.status === 204) {
        onClose();
        refetchData();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Model open={open} onClose={onClose} containerClassName=" noHeader">
      <div className="flex items-center justify-center gap-8 py-3 flex-col">
        <span className="flex items-center justify-center">
          <FaRegTrashCan size={70} color="var(--error)" />
        </span>
        <p className="text-natural-light font-semibold text-center ">
          {" "}
          Are you sure you want to delete this?
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="error"
            onClick={handleDelete}
            loading={loading}
            disabled={loading}
            loaderClass="fill-white"
          >
            Delete
          </Button>
          <Button type="cancel" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Model>
  );
};

export default ConfirmDelete;
