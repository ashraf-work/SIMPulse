import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export function DataTable({ columns, rows, getRowKey }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <Th key={column.key} className={column.className}>{column.header}</Th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors duration-150 hover:bg-slate-50/80">
                {columns.map((column) => (
                  <Td key={column.key} className={column.cellClassName}>
                    {column.render ? column.render(row) : row[column.key]}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
