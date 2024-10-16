"use client";

import { Add } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import MachineForm from "./forms/MachineForm";

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "machine"
    | "sensor"
    | "monitoringPoint"
    | "sensorModel"
    | "machineType";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const getIcon = () => {
    switch (type) {
      case "create":
        return <Add />;
      case "update":
        return <EditIcon />;
      case "delete":
        return <DeleteIcon />;
      default:
        return null;
    }
  };
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const forms: {
    [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
  } = {
    machine: (type, data) => <MachineForm type={type} data={data} />,
  };

  const Form = () => {
    return type === "delete" && id ? (
      <form>
        <span>
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            /* handle delete */
          }}
        >
          Delete
        </Button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ minWidth: 0, padding: 1 }}
        onClick={() => setOpen(true)}
      >
        {getIcon()}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            disableElevation
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              minWidth: 0,
              padding: 0,
              backgroundColor: "transparent",
            }}
          >
            <CloseOutlinedIcon
              sx={{
                color: "black",
                "&:hover": {
                  color: "red",
                },
              }}
            />
          </Button>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            {type === "create"
              ? `Create new ${table}`
              : type === "update"
              ? `Update ${table}`
              : `Delete ${table}`}
          </Typography>

          <Form />
        </Box>
      </Modal>
    </>
  );
};

export default FormModal;
