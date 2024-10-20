"use client";

import { Add } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Dispatch, SetStateAction, useState } from "react";
import MachineForm from "./forms/MachineForm";
import MonitoringPointForm from "./forms/MonitoringPointForm";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteMachine } from "../lib/actions";

import { SyntheticEvent } from "react";
import { FormContainerProps } from "./FormContainer";
import SensorModelForm from "./forms/SensorModelForm";

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData: any }) => {
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
    [key: string]: (
      setOpen: Dispatch<SetStateAction<boolean>>,
      type: "create" | "update",
      data?: any,
      relatedData?: any
    ) => JSX.Element;
  } = {
    machine: (setOpen, type, data) => (
      <MachineForm type={type} data={data} setOpen={setOpen} />
    ),
    monitoringPoint: (setOpen, type, data, relatedData) => (
      <MonitoringPointForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    allMonitoringPoints: (setOpen, type, data, relatedData) => (
      <SensorModelForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
  };

  const Form = () => {
    const router = useRouter();
    const handleDelete = async (event: SyntheticEvent) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);

      const result = await deleteMachine(
        { success: false, error: false },
        formData
      );

      if (result.success) {
        toast.success(`${table} successfully deleted`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(`Failed to delete ${table}`);
      }
    };

    return type === "delete" && id ? (
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
        onSubmit={handleDelete}
      >
        <input type="number" name="id" value={id} hidden readOnly />
        <Typography variant="body1" align="center">
          All data will be lost. Are you sure you want to delete this {table}?
        </Typography>
        <Button variant="contained" color="error" sx={{ mt: 2 }} type="submit">
          Delete
        </Button>
      </Box>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
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
