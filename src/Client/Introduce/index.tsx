/* eslint-disable max-len */

import { useArchive } from "@/hooks/useArchive";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { getIntroduction } from "@/services/store/introduction/introduction.thunk";
import { useEffect } from "react";

const Introduce = () => {
  const { state, dispatch } = useArchive<IIntroductionInitialState>("introduction");
  useEffect(() => {
    dispatch(getIntroduction({}))
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto my-8 space-y-6">
        <div dangerouslySetInnerHTML={{ __html: state.introduction.introduction }}/>
    </div>

  );
};

export default Introduce;
