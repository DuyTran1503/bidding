/* eslint-disable max-len */

import { useArchive } from "@/hooks/useArchive";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { getInstruct } from "@/services/store/instruct/instruct.thunk";
import { useEffect } from "react";

const Instruct = () => {
  const { state, dispatch } = useArchive<IInstructInitialState>("instruct");
  useEffect(() => {
    dispatch(getInstruct({}))
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto my-8 space-y-6">
        <div dangerouslySetInnerHTML={{ __html: state.instruct?.instruct }}/>
    </div>

  );
};

export default Instruct;
