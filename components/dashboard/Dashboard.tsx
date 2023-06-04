import React, { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";

import { useAppSelector } from "redux/hooks";
import { Session } from "lib/auth/auth";
import MonitoringPointDashboard from "lib/utils/types/monitoring-point-dashboard";
import { PostResult } from "lib/utils/post/post-result";
import Card from "./Card";

export const postResultMsg: PostResult = {
  SUCCESS: "Usuário criado com sucesso",
  DATA_CONFLICT: "Esse email já está cadastrado",
  BAD_CREDENTIALS: "Você precisa estar logado",
  BAD_RESPONSE: "Servidor respondeu de forma inesperada",
  FETCH_ERROR: "Servidor parece estar offline. Tente mais tarde",
  UNKNOW_ERROR: "Erro desconhecido",
};

export async function get(
  readRoute: string,
  session: Session | null
): Promise<
  { count: number; monitoringPoints: MonitoringPointDashboard[] } | string
> {
  if (!session) {
    return postResultMsg.BAD_CREDENTIALS;
  }

  const response = await fetch(readRoute, {
    headers: {
      Authorization: "Bearer " + session.token,
    },
    method: "GET",
  }).catch(() => null);

  if (!response) {
    return postResultMsg.FETCH_ERROR;
  } else if (response.status === 409) {
    return postResultMsg.DATA_CONFLICT;
  } else if (response.status === 401) {
    return postResultMsg.BAD_CREDENTIALS;
  } else if (response.status !== 200) {
    return postResultMsg.UNKNOW_ERROR;
  }

  const postResponse = await response.json().catch(() => null);

  if (
    !Array.isArray(postResponse?.monitoringPoints) &&
    typeof postResponse?.count != "number"
  ) {
    return postResultMsg.BAD_RESPONSE;
  } else {
    return postResponse;
  }
}

export default function Dashboard() {
  const session = useAppSelector((state) => state.sessionReducer.session);

  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);

  const [monitoringPointList, setMonitoringPointList] = useState<
    MonitoringPointDashboard[]
  >([]);
  const [monitoringPointListError, setMonitoringPointListError] = useState<
    string | null
  >(null);

  const getList = async (page: number) => {
    const skip = (page - 1) * 5;
    const take = skip + 5;
    const sensorsResponse = await get(
      `/api/monitoring-point/read/pagination/${skip}/${take}`,
      session
    );
    if (typeof sensorsResponse == "string") {
      setMonitoringPointListError(sensorsResponse);
    } else if (Array.isArray(sensorsResponse.monitoringPoints)) {
      setMonitoringPointList(
        sensorsResponse.monitoringPoints as MonitoringPointDashboard[]
      );
      setCount(sensorsResponse.count as number);
      setMonitoringPointListError(null);
    }
  };

  useEffect(() => {
    if (session?.token) getList(page);
  }, [session?.token, page]);

  const handlePaginationChange = (e, p) => {
    setPage(p);
  };

  return (
    <Container
      sx={{
        mt: 5,
        mb: 5,
        height: "80%",
      }}
    >
      <Grid container spacing={1} columns={20}>
        {monitoringPointList.map((mp, index) => (
          <Card
            key={index}
            name={mp.name}
            machineName={mp.machine?.name || ""}
            machineType={mp.machine?.type || ""}
            sensorName={mp.sensor?.name || ""}
            sensorModel={mp.sensor?.model || ""}
          />
        ))}
        {monitoringPointListError && (
          <Alert severity="error">{monitoringPointListError}</Alert>
        )}
      </Grid>
      <Pagination
        count={Math.ceil(count / 5)}
        shape="rounded"
        onChange={handlePaginationChange}
      />
    </Container>
  );
}
