import React from "react";
import { Dialog } from "primereact/dialog";

const Model = ({
  open,
  onClose,
  containerClassName = "",
  header,
  children,
}) => {
  return (
    <Dialog
      visible={open}
      onHide={() => onClose()}
      className={`${containerClassName} modal  `}
      header={header}
      draggable={false}
    >
      <div className={`mt-5`}>{children}</div>
    </Dialog>
  );
};

export default Model;
