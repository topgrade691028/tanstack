import { useState,useReducer } from 'react'

import './index.css';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    Column,
    ColumnDef,
    ColumnFiltersState,
    RowData,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from '@tanstack/react-table'


type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
    columnHelper.group({
        id: 'Full Name',
        header: () => <span>Full Name</span>,
        columns: [
            columnHelper.accessor('firstName', {
                cell: info => info.getValue(),
                footer: info => info.column.id,
            }),
            columnHelper.accessor(row => row.lastName, {
                id: 'lastName',
                cell: info => <i>{info.getValue()}</i>,
                header: () => <span>Last Name</span>,
                footer: info => info.column.id,
            }),
        ]
    }),
    columnHelper.group({
        id: "Info",
        header: () => <span>Info</span>,
        columns: [
            columnHelper.accessor('age', {
                header: () => 'Age',
                cell: info => info.renderValue(),
                footer: info => info.column.id,
            }),
            columnHelper.accessor('visits', {
                header: () => <span>Visits</span>,
                footer: info => info.column.id,
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                footer: info => info.column.id,
            }),
            columnHelper.accessor('progress', {
                header: 'Profile Progress',
                footer: info => info.column.id,
            })
        ]
    })
]

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue>{
        filterVariant?:'text'|'range'|'select'
    }
}

const Basic = () => {
    const [data, setData] = useState(() => [...defaultData]);
    const rerender = useReducer(() => ({}), { data })[1];
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default Basic;