import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
  MouseEvent,
} from "react";

import { makeRequest } from "./api";
import { getFloatValue } from "./form";

export const SpawnObjectForm: FunctionComponent = () => {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const onChangeX = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const val = getFloatValue(ev.target.value);
      setX(val);
    },
    [setX]
  );

  const onChangeY = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const val = getFloatValue(ev.target.value);
      setY(val);
    },
    [setY]
  );

  const onChangeZ = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const val = getFloatValue(ev.target.value);
      setZ(val);
    },
    [setZ]
  );

  const onSubmit = useCallback(
    async (ev: MouseEvent<HTMLInputElement>) => {
      ev.preventDefault();
      ev.stopPropagation();

      const response = await makeRequest("/api/command/SpawnObject", "POST", {
        x,
        y,
        z,
      });

      if (response.ok) {
        const json = await response.json();

        if (json.success) {
          setMessage(`${json.message}: ${json.id}`);
        } else {
          setMessage(json.message);
        }
      }
    },
    [x, y, z, setMessage]
  );

  return (
    <form>
      <label htmlFor="x">X:</label>
      <input type="text" name="x" id="x" onChange={onChangeX} />
      <label htmlFor="y">Y:</label>
      <input type="text" name="y" id="y" onChange={onChangeY} />
      <label htmlFor="z">Z:</label>
      <input type="text" name="z" id="z" onChange={onChangeZ} />
      <input type="submit" value="Spawn" onClick={onSubmit} />
      <div>{message}</div>
    </form>
  );
};
