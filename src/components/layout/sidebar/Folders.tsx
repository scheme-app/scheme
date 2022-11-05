import { FC } from "react";
import { Folder } from "./Folder";
import type { FolderPropTypes } from "./Folder";
import type { RoutePropTypes } from "./Route";

type PropTypes = {
  folders: Array<FolderPropTypes>;
};

const Folders: FC<PropTypes> = ({ folders }) => {
  return (
    <>
      {folders &&
        folders.map((folder: FolderPropTypes) => (
          <Folder
            key={folder.id}
            id={folder.id}
            name={folder.name}
            routes={folder.routes.map((route: RoutePropTypes) => {
              return {
                id: route.id,
                name: route.name,
                type: route.type,
              };
            })}
          />
        ))}
    </>
  );
};

export { Folders };
