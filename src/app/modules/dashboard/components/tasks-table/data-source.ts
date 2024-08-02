import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Task } from "../../../../models/task.model";
import { BehaviorSubject, Observable } from "rxjs";


export class DataSourceTask extends DataSource<Task> {
    data = new BehaviorSubject<Task[]>([]);

    init(tasks: Task[]) {
        this.data.next(tasks);
    }

    override connect(collectionViewer: CollectionViewer): Observable<readonly Task[]> {
        return this.data;
    }

    override disconnect(collectionViewer: CollectionViewer): void { }
}