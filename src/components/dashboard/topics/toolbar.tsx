import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Lightbulb, Plus } from "lucide-react";
import { CreateTopicDialog } from "./create-dialog";

export function TopicsToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="relative min-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by topic name" className="pl-9" />
      </div>
      <div className="flex items-center gap-2">
        <CreateTopicDialog>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Topic
          </Button>
        </CreateTopicDialog>
        <Button variant="outline" size="sm" className="gap-2">
          <Lightbulb className="h-4 w-4" />
          Suggest Topics
        </Button>
      </div>
    </div>
  );
}
