import React, { FunctionComponent } from "react";

import { SpawnObjectForm } from "./spawnObjectForm";
import { MoveObjectForm } from "./moveObjectForm";
import { ObjectList } from "./objectList";

export const App: FunctionComponent = () => {
  return (
    <>
      <ObjectList />
      <SpawnObjectForm />
      <MoveObjectForm />
    </>
  );
};
