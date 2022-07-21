import React, { FunctionComponent } from "react";

import { SpawnObjectForm } from "./spawnObjectForm";
import { MoveObjectForm } from "./moveObjectForm";

export const App: FunctionComponent = () => {
  return (
    <>
      <SpawnObjectForm />
      <MoveObjectForm />
    </>
  );
};
