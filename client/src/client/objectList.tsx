import React, { FunctionComponent, useCallback, useState } from "react";

import { makeRequest } from "./api";

interface ObjectListItem {
  Id: number;
  X: number;
  Y: number;
  Z: number;
}

export const ObjectList: FunctionComponent = () => {
  const [objects, setObjects] = useState<ObjectListItem[]>([]);

  const loadObjects = useCallback(async () => {
    const response = await makeRequest("/api/query/Objects", "GET");

    if (response.ok) {
      const json = await response.json();
      if (json) {
        setObjects(json.objects);
      }
    }
  }, [setObjects]);

  return (
    <div>
      <div>Objects:</div>
      <ul>
        {objects && objects.length === 0 && <li>No objects found</li>}
        {objects &&
          objects.length > 0 &&
          objects.map((obj) => {
            return (
              <li>
                <div>
                  <div>Id: {obj.Id}</div>
                  <div>X: {obj.X}</div>
                  <div>Y: {obj.Y}</div>
                  <div>Z: {obj.Z}</div>
                </div>
              </li>
            );
          })}
      </ul>
      <button onClick={loadObjects}>Refresh</button>
    </div>
  );
};
