import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IRow,
  Table,
  TableBody,
  TableHeader,
  Tr
} from '@patternfly/react-table';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title
} from '@patternfly/react-core';
import { ExclamationCircleIcon, SearchIcon } from '@patternfly/react-icons';
import ExecutionStatus from '../../Atoms/ExecutionStatus/ExecutionStatus';
import FormattedDate from '../../Atoms/FormattedDate/FormattedDate';
import skeletonRows from '../../../utils/skeletonRows/skeletonRows';
import ExecutionId from '../../Atoms/ExecutionId/ExecutionId';
import {
  Execution,
  Executions,
  RemoteData,
  RemoteDataStatus
} from '../../../types';

type ExecutionTableProps = {
  data: RemoteData<Error, Executions>;
};

const ExecutionTable: React.FC<ExecutionTableProps> = props => {
  const { data } = props;
  const columns = ['ID', 'Description', 'Executor', 'Date', 'Execution status'];
  const [rows, setRows] = useState<IRow[]>(prepareRows(columns.length, data));

  useEffect(() => {
    setRows(prepareRows(columns.length, data));
  }, [data, columns.length]);

  const customRowWrapper = ({ row, rowProps, ...props }) => {
    const [rowKey, rowIndex] = rowProps;
    return (
      <Tr
        ouiaId={row.ouiaId}
        data-key={rowKey} //The "Tr" element does not know "rowKey". When this row is missing then Chrome's console contains Warning.
        data-index={rowIndex} //The "Tr" element does not know "rowIndex". When this row is missing then Chrome's console contains Warning.
        {...props} //rows disappear when "props" is missing
      />
    );
  };

  return (
    <Table
      cells={columns}
      rows={rows}
      rowWrapper={customRowWrapper}
      aria-label="Executions list"
      ouiaId="exec-table"
    >
      <TableHeader />
      <TableBody rowKey="executionKey" />
    </Table>
  );
};

const prepareRows = (
  columnsNumber: number,
  data: RemoteData<Error, Executions>
) => {
  let rows;
  switch (data.status) {
    case RemoteDataStatus.NOT_ASKED:
    case RemoteDataStatus.LOADING:
      rows = skeletonRows(columnsNumber, 10, 'executionKey');
      break;
    case RemoteDataStatus.SUCCESS:
      if (data.data.headers.length > 0) {
        rows = prepareExecutionsRows(data.data.headers);
      } else {
        rows = noExecutions(columnsNumber);
      }
      break;
    case RemoteDataStatus.FAILURE:
      rows = loadingError(columnsNumber);
      break;
  }
  return rows;
};

const prepareExecutionsRows = (rowData: Execution[]) => {
  return rowData.map(item => ({
    executionKey: 'key-' + item.executionId,
    ouiaId: item.executionId,
    cells: [
      {
        title: (
          <Link
            to={`/audit/${item.executionType.toLocaleLowerCase()}/${
              item.executionId
            }`}
            data-ouia-component-id="show-detail"
            data-ouia-component-type="link"
          >
            <ExecutionId id={item.executionId} />
          </Link>
        )
      },
      item.executedModelName,
      item.executorName,
      { title: <FormattedDate date={item.executionDate} /> },
      {
        title: (
          <ExecutionStatus
            result={item.executionSucceeded ? 'success' : 'failure'}
            ouiaId="status"
          />
        )
      }
    ]
  }));
};

const noExecutions = (colSpan: number) => {
  return [
    {
      heightAuto: true,
      executionKey: 'no-results',
      cells: [
        {
          props: { colSpan },
          title: (
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h5" size="lg">
                  No executions found
                </Title>
                <EmptyStateBody>
                  No results match the filter criteria. Try removing all
                  filters.
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          )
        }
      ]
    }
  ];
};

const loadingError = (colSpan: number) => {
  return [
    {
      heightAuto: true,
      executionKey: 'no-results',
      cells: [
        {
          props: { colSpan },
          title: (
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={ExclamationCircleIcon} color="#C9190B" />
                <Title headingLevel="h5" size="lg">
                  Cannot load data
                </Title>
                <EmptyStateBody>
                  Try refreshing the page after a few minutes. If the problem
                  persists, contact Customer Support.
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          )
        }
      ]
    }
  ];
};

export default ExecutionTable;
