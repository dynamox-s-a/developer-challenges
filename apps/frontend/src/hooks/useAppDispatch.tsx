import { useDispatch } from "react-redux";
import type { AppDispatch } from "../lib/redux/store";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
