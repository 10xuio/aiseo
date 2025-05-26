import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageSquare,
  Eye,
  Trophy,
  Tags,
  Globe,
  Calendar,
} from "lucide-react";

export function PromptsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead>
          <Checkbox />
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Prompt
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visibility
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Top
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Tags
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geo
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Created
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
