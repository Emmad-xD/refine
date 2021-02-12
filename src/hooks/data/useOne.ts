import { useContext } from "react";
import { QueryObserverResult, useQuery } from "react-query";

import { DataContext } from "@contexts/data";
import { GetOneResponse, IDataContext } from "@interfaces";

export const useOne = (
    resource: string,
    id: string,
): QueryObserverResult<GetOneResponse, unknown> => {
    const { getOne } = useContext<IDataContext>(DataContext);

    const queryResponse = useQuery<GetOneResponse>(
        `resource/getOne/${resource}`,
        () => getOne(resource, id),
    );

    return queryResponse;
};