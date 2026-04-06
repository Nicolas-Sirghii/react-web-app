  import { useSelector } from "react-redux";
  
export function useLogin() {
    const { path } = useSelector((state) => state.path);
    return path

}