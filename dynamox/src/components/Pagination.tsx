"use client";

import { Stack } from "@mui/material";
import * as React from "react";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "@/src/app/redux/store/paginationSlice";
import { RootState } from "@/src/app/redux/store/store";

const PaginationButton = ({ count }: { count: number }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const page = useSelector((state: RootState) => state.pagination.page);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const initialPage = parseInt(params.get("page") || "1", 10);
      dispatch(setPage(initialPage));
    }
  }, [dispatch]);

  const changePage = React.useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage.toString());
      router.push(`${window.location.pathname}?${params}`);
      dispatch(setPage(newPage));
    },
    [router, dispatch]
  );

  return (
    <Stack spacing={2} alignItems="center">
      <Pagination
        page={page}
        count={Math.ceil(count / 10)}
        shape="rounded"
        color="primary"
        onChange={(_, value) => changePage(value)}
      />
    </Stack>
  );
};

export default PaginationButton;
