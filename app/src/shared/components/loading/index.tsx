import Skeleton from "@mui/material/Skeleton";

export default function Variants() {
  return (
    <>
      <Skeleton
        animation="wave"
        variant="rounded"
        width={"100%"}
        height={100}
      />
      <Skeleton animation="wave" variant="text" sx={{ fontSize: "3rem" }} />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={"100%"}
        height={100}
      />
      <Skeleton animation="wave" variant="text" sx={{ fontSize: "3rem" }} />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={"100%"}
        height={100}
      />
      <Skeleton animation="wave" variant="text" sx={{ fontSize: "3rem" }} />
      <Skeleton
        animation="wave"
        variant="rounded"
        width={"100%"}
        height={100}
      />
      <Skeleton animation="wave" variant="text" sx={{ fontSize: "3rem" }} />
    </>
  );
}
