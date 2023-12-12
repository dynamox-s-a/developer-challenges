import { Dispatch, SetStateAction } from "react";

type SetStateFunction<T = any> = Dispatch<SetStateAction<T>>;
