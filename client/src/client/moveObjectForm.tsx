import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
  MouseEvent,
} from "react";

import { makeRequest } from "./api";
import { getFloatValue, getIntegerValue } from "./form";

export const MoveObjectForm: FunctionComponent = () => {
  const [id, setId] = useState<number>(0);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [z, setZ] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const onChangeId = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const val = getIntegerValue(ev.target.value);
      setId(val);
    },
    [setId]
  );

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

      const response = await makeRequest("/api/command/MoveObject", "POST", {
        id,
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
    [id, x, y, z, setMessage]
  );

  return (
    <form>
      <label htmlFor="objectId">Id:</label>
      <input type="text" name="objectId" id="objectId" onChange={onChangeId} />
      <label htmlFor="x">X:</label>
      <input type="text" name="x" id="x" onChange={onChangeX} />
      <label htmlFor="y">Y:</label>
      <input type="text" name="y" id="y" onChange={onChangeY} />
      <label htmlFor="z">Z:</label>
      <input type="text" name="z" id="z" onChange={onChangeZ} />
      <input type="submit" value="Move" onClick={onSubmit} />
      <div>{message}</div>
    </form>
  );
};
