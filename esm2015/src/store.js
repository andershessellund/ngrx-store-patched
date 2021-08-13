/* eslint-disable @typescript-eslint/naming-convention */
// disabled because we have lowercase generics for `select`
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';
import { ActionsSubject } from './actions_subject';
import { ReducerManager } from './reducer_manager';
import { StateObservable } from './state';
export class Store extends Observable {
    constructor(state$, actionsObserver, reducerManager) {
        super();
        this.actionsObserver = actionsObserver;
        this.reducerManager = reducerManager;
        this.source = state$;
    }
    select(pathOrMapFn, ...paths) {
        return select.call(null, pathOrMapFn, ...paths)(this);
    }
    lift(operator) {
        const store = new Store(this, this.actionsObserver, this.reducerManager);
        store.operator = operator;
        return store;
    }
    dispatch(action) {
        this.actionsObserver.next(action);
    }
    next(action) {
        this.actionsObserver.next(action);
    }
    error(err) {
        this.actionsObserver.error(err);
    }
    complete() {
        this.actionsObserver.complete();
    }
    addReducer(key, reducer) {
        this.reducerManager.addReducer(key, reducer);
    }
    removeReducer(key) {
        this.reducerManager.removeReducer(key);
    }
}
Store.decorators = [
    { type: Injectable }
];
/** @nocollapse */
Store.ctorParameters = () => [
    { type: StateObservable },
    { type: ActionsSubject },
    { type: ReducerManager }
];
export const STORE_PROVIDERS = [Store];
export function select(pathOrMapFn, propsOrPath, ...paths) {
    return function selectOperator(source$) {
        let mapped$;
        if (typeof pathOrMapFn === 'string') {
            const pathSlices = [propsOrPath, ...paths].filter(Boolean);
            mapped$ = source$.pipe(pluck(pathOrMapFn, ...pathSlices));
        }
        else if (typeof pathOrMapFn === 'function') {
            mapped$ = source$.pipe(map((source) => pathOrMapFn(source, propsOrPath)));
        }
        else {
            throw new TypeError(`Unexpected type '${typeof pathOrMapFn}' in select operator,` +
                ` expected 'string' or 'function'`);
        }
        return mapped$.pipe(distinctUntilChanged());
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlL3NyYy9zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5REFBeUQ7QUFDekQsMkRBQTJEO0FBQzNELE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBc0IsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFHMUMsTUFBTSxPQUFPLEtBQ1gsU0FBUSxVQUFhO0lBRXJCLFlBQ0UsTUFBdUIsRUFDZixlQUErQixFQUMvQixjQUE4QjtRQUV0QyxLQUFLLEVBQUUsQ0FBQztRQUhBLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUMvQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFJdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQWlFRCxNQUFNLENBQ0osV0FBc0QsRUFDdEQsR0FBRyxLQUFlO1FBRWxCLE9BQVEsTUFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELElBQUksQ0FBSSxRQUF3QjtRQUM5QixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUUsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFMUIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsUUFBUSxDQUNOLE1BSUc7UUFFSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBSSxDQUFDLE1BQWM7UUFDakIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFRO1FBQ1osSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxVQUFVLENBQ1IsR0FBVyxFQUNYLE9BQXNDO1FBRXRDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsYUFBYSxDQUF1QyxHQUFRO1FBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7OztZQTFIRixVQUFVOzs7O1lBRkYsZUFBZTtZQUhmLGNBQWM7WUFFZCxjQUFjOztBQWdJdkIsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUF5Rm5ELE1BQU0sVUFBVSxNQUFNLENBQ3BCLFdBQXdELEVBQ3hELFdBQTRCLEVBQzVCLEdBQUcsS0FBZTtJQUVsQixPQUFPLFNBQVMsY0FBYyxDQUFDLE9BQXNCO1FBQ25ELElBQUksT0FBd0IsQ0FBQztRQUU3QixJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsRUFBRTtZQUNuQyxNQUFNLFVBQVUsR0FBRyxDQUFTLFdBQVcsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUMzRDthQUFNLElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO1lBQzVDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUNwQixHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQVMsV0FBVyxDQUFDLENBQUMsQ0FDekQsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLElBQUksU0FBUyxDQUNqQixvQkFBb0IsT0FBTyxXQUFXLHVCQUF1QjtnQkFDM0Qsa0NBQWtDLENBQ3JDLENBQUM7U0FDSDtRQUVELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuLy8gZGlzYWJsZWQgYmVjYXVzZSB3ZSBoYXZlIGxvd2VyY2FzZSBnZW5lcmljcyBmb3IgYHNlbGVjdGBcbmltcG9ydCB7IEluamVjdGFibGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciwgT3BlcmF0b3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHBsdWNrIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBBY3Rpb25zU3ViamVjdCB9IGZyb20gJy4vYWN0aW9uc19zdWJqZWN0JztcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUmVkdWNlciwgRnVuY3Rpb25Jc05vdEFsbG93ZWQgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZWR1Y2VyTWFuYWdlciB9IGZyb20gJy4vcmVkdWNlcl9tYW5hZ2VyJztcbmltcG9ydCB7IFN0YXRlT2JzZXJ2YWJsZSB9IGZyb20gJy4vc3RhdGUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvcmU8VCA9IG9iamVjdD5cbiAgZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+XG4gIGltcGxlbWVudHMgT2JzZXJ2ZXI8QWN0aW9uPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHN0YXRlJDogU3RhdGVPYnNlcnZhYmxlLFxuICAgIHByaXZhdGUgYWN0aW9uc09ic2VydmVyOiBBY3Rpb25zU3ViamVjdCxcbiAgICBwcml2YXRlIHJlZHVjZXJNYW5hZ2VyOiBSZWR1Y2VyTWFuYWdlclxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zb3VyY2UgPSBzdGF0ZSQ7XG4gIH1cblxuICBzZWxlY3Q8Sz4obWFwRm46IChzdGF0ZTogVCkgPT4gSyk6IE9ic2VydmFibGU8Sz47XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBTZWxlY3RvcnMgd2l0aCBwcm9wcyBhcmUgZGVwcmVjYXRlZCwgZm9yIG1vcmUgaW5mbyBzZWUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9uZ3J4L3BsYXRmb3JtL2lzc3Vlcy8yOTgwIEdpdGh1YiBJc3N1ZX1cbiAgICovXG4gIHNlbGVjdDxLLCBQcm9wcyA9IGFueT4oXG4gICAgbWFwRm46IChzdGF0ZTogVCwgcHJvcHM6IFByb3BzKSA9PiBLLFxuICAgIHByb3BzOiBQcm9wc1xuICApOiBPYnNlcnZhYmxlPEs+O1xuICBzZWxlY3Q8YSBleHRlbmRzIGtleW9mIFQ+KGtleTogYSk6IE9ic2VydmFibGU8VFthXT47XG4gIHNlbGVjdDxhIGV4dGVuZHMga2V5b2YgVCwgYiBleHRlbmRzIGtleW9mIFRbYV0+KFxuICAgIGtleTE6IGEsXG4gICAga2V5MjogYlxuICApOiBPYnNlcnZhYmxlPFRbYV1bYl0+O1xuICBzZWxlY3Q8YSBleHRlbmRzIGtleW9mIFQsIGIgZXh0ZW5kcyBrZXlvZiBUW2FdLCBjIGV4dGVuZHMga2V5b2YgVFthXVtiXT4oXG4gICAga2V5MTogYSxcbiAgICBrZXkyOiBiLFxuICAgIGtleTM6IGNcbiAgKTogT2JzZXJ2YWJsZTxUW2FdW2JdW2NdPjtcbiAgc2VsZWN0PFxuICAgIGEgZXh0ZW5kcyBrZXlvZiBULFxuICAgIGIgZXh0ZW5kcyBrZXlvZiBUW2FdLFxuICAgIGMgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdLFxuICAgIGQgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdW2NdXG4gID4oa2V5MTogYSwga2V5MjogYiwga2V5MzogYywga2V5NDogZCk6IE9ic2VydmFibGU8VFthXVtiXVtjXVtkXT47XG4gIHNlbGVjdDxcbiAgICBhIGV4dGVuZHMga2V5b2YgVCxcbiAgICBiIGV4dGVuZHMga2V5b2YgVFthXSxcbiAgICBjIGV4dGVuZHMga2V5b2YgVFthXVtiXSxcbiAgICBkIGV4dGVuZHMga2V5b2YgVFthXVtiXVtjXSxcbiAgICBlIGV4dGVuZHMga2V5b2YgVFthXVtiXVtjXVtkXVxuICA+KGtleTE6IGEsIGtleTI6IGIsIGtleTM6IGMsIGtleTQ6IGQsIGtleTU6IGUpOiBPYnNlcnZhYmxlPFRbYV1bYl1bY11bZF1bZV0+O1xuICBzZWxlY3Q8XG4gICAgYSBleHRlbmRzIGtleW9mIFQsXG4gICAgYiBleHRlbmRzIGtleW9mIFRbYV0sXG4gICAgYyBleHRlbmRzIGtleW9mIFRbYV1bYl0sXG4gICAgZCBleHRlbmRzIGtleW9mIFRbYV1bYl1bY10sXG4gICAgZSBleHRlbmRzIGtleW9mIFRbYV1bYl1bY11bZF0sXG4gICAgZiBleHRlbmRzIGtleW9mIFRbYV1bYl1bY11bZF1bZV1cbiAgPihcbiAgICBrZXkxOiBhLFxuICAgIGtleTI6IGIsXG4gICAga2V5MzogYyxcbiAgICBrZXk0OiBkLFxuICAgIGtleTU6IGUsXG4gICAga2V5NjogZlxuICApOiBPYnNlcnZhYmxlPFRbYV1bYl1bY11bZF1bZV1bZl0+O1xuICBzZWxlY3Q8XG4gICAgYSBleHRlbmRzIGtleW9mIFQsXG4gICAgYiBleHRlbmRzIGtleW9mIFRbYV0sXG4gICAgYyBleHRlbmRzIGtleW9mIFRbYV1bYl0sXG4gICAgZCBleHRlbmRzIGtleW9mIFRbYV1bYl1bY10sXG4gICAgZSBleHRlbmRzIGtleW9mIFRbYV1bYl1bY11bZF0sXG4gICAgZiBleHRlbmRzIGtleW9mIFRbYV1bYl1bY11bZF1bZV0sXG4gICAgSyA9IGFueVxuICA+KFxuICAgIGtleTE6IGEsXG4gICAga2V5MjogYixcbiAgICBrZXkzOiBjLFxuICAgIGtleTQ6IGQsXG4gICAga2V5NTogZSxcbiAgICBrZXk2OiBmLFxuICAgIC4uLnBhdGhzOiBzdHJpbmdbXVxuICApOiBPYnNlcnZhYmxlPEs+O1xuICBzZWxlY3Q8UHJvcHMgPSBhbnksIEsgPSBhbnk+KFxuICAgIHBhdGhPck1hcEZuOiAoKHN0YXRlOiBULCBwcm9wcz86IFByb3BzKSA9PiBLKSB8IHN0cmluZyxcbiAgICAuLi5wYXRoczogc3RyaW5nW11cbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gKHNlbGVjdCBhcyBhbnkpLmNhbGwobnVsbCwgcGF0aE9yTWFwRm4sIC4uLnBhdGhzKSh0aGlzKTtcbiAgfVxuXG4gIGxpZnQ8Uj4ob3BlcmF0b3I6IE9wZXJhdG9yPFQsIFI+KTogU3RvcmU8Uj4ge1xuICAgIGNvbnN0IHN0b3JlID0gbmV3IFN0b3JlPFI+KHRoaXMsIHRoaXMuYWN0aW9uc09ic2VydmVyLCB0aGlzLnJlZHVjZXJNYW5hZ2VyKTtcbiAgICBzdG9yZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuXG4gICAgcmV0dXJuIHN0b3JlO1xuICB9XG5cbiAgZGlzcGF0Y2g8ViBleHRlbmRzIEFjdGlvbiA9IEFjdGlvbj4oXG4gICAgYWN0aW9uOiBWICZcbiAgICAgIEZ1bmN0aW9uSXNOb3RBbGxvd2VkPFxuICAgICAgICBWLFxuICAgICAgICAnRnVuY3Rpb25zIGFyZSBub3QgYWxsb3dlZCB0byBiZSBkaXNwYXRjaGVkLiBEaWQgeW91IGZvcmdldCB0byBjYWxsIHRoZSBhY3Rpb24gY3JlYXRvciBmdW5jdGlvbj8nXG4gICAgICA+XG4gICkge1xuICAgIHRoaXMuYWN0aW9uc09ic2VydmVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIG5leHQoYWN0aW9uOiBBY3Rpb24pIHtcbiAgICB0aGlzLmFjdGlvbnNPYnNlcnZlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBlcnJvcihlcnI6IGFueSkge1xuICAgIHRoaXMuYWN0aW9uc09ic2VydmVyLmVycm9yKGVycik7XG4gIH1cblxuICBjb21wbGV0ZSgpIHtcbiAgICB0aGlzLmFjdGlvbnNPYnNlcnZlci5jb21wbGV0ZSgpO1xuICB9XG5cbiAgYWRkUmVkdWNlcjxTdGF0ZSwgQWN0aW9ucyBleHRlbmRzIEFjdGlvbiA9IEFjdGlvbj4oXG4gICAga2V5OiBzdHJpbmcsXG4gICAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxTdGF0ZSwgQWN0aW9ucz5cbiAgKSB7XG4gICAgdGhpcy5yZWR1Y2VyTWFuYWdlci5hZGRSZWR1Y2VyKGtleSwgcmVkdWNlcik7XG4gIH1cblxuICByZW1vdmVSZWR1Y2VyPEtleSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVCwgc3RyaW5nPj4oa2V5OiBLZXkpIHtcbiAgICB0aGlzLnJlZHVjZXJNYW5hZ2VyLnJlbW92ZVJlZHVjZXIoa2V5KTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgU1RPUkVfUFJPVklERVJTOiBQcm92aWRlcltdID0gW1N0b3JlXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdDxULCBLPihcbiAgbWFwRm46IChzdGF0ZTogVCkgPT4gS1xuKTogKHNvdXJjZSQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8Sz47XG4vKipcbiAqIEBkZXByZWNhdGVkIFNlbGVjdG9ycyB3aXRoIHByb3BzIGFyZSBkZXByZWNhdGVkLCBmb3IgbW9yZSBpbmZvIHNlZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL25ncngvcGxhdGZvcm0vaXNzdWVzLzI5ODAgR2l0aHViIElzc3VlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0PFQsIFByb3BzLCBLPihcbiAgbWFwRm46IChzdGF0ZTogVCwgcHJvcHM6IFByb3BzKSA9PiBLLFxuICBwcm9wczogUHJvcHNcbik6IChzb3VyY2UkOiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlPEs+O1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdDxULCBhIGV4dGVuZHMga2V5b2YgVD4oXG4gIGtleTogYVxuKTogKHNvdXJjZSQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8VFthXT47XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0PFQsIGEgZXh0ZW5kcyBrZXlvZiBULCBiIGV4dGVuZHMga2V5b2YgVFthXT4oXG4gIGtleTE6IGEsXG4gIGtleTI6IGJcbik6IChzb3VyY2UkOiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlPFRbYV1bYl0+O1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdDxcbiAgVCxcbiAgYSBleHRlbmRzIGtleW9mIFQsXG4gIGIgZXh0ZW5kcyBrZXlvZiBUW2FdLFxuICBjIGV4dGVuZHMga2V5b2YgVFthXVtiXVxuPihcbiAga2V5MTogYSxcbiAga2V5MjogYixcbiAga2V5MzogY1xuKTogKHNvdXJjZSQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8VFthXVtiXVtjXT47XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0PFxuICBULFxuICBhIGV4dGVuZHMga2V5b2YgVCxcbiAgYiBleHRlbmRzIGtleW9mIFRbYV0sXG4gIGMgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdLFxuICBkIGV4dGVuZHMga2V5b2YgVFthXVtiXVtjXVxuPihcbiAga2V5MTogYSxcbiAga2V5MjogYixcbiAga2V5MzogYyxcbiAga2V5NDogZFxuKTogKHNvdXJjZSQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8VFthXVtiXVtjXVtkXT47XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0PFxuICBULFxuICBhIGV4dGVuZHMga2V5b2YgVCxcbiAgYiBleHRlbmRzIGtleW9mIFRbYV0sXG4gIGMgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdLFxuICBkIGV4dGVuZHMga2V5b2YgVFthXVtiXVtjXSxcbiAgZSBleHRlbmRzIGtleW9mIFRbYV1bYl1bY11bZF1cbj4oXG4gIGtleTE6IGEsXG4gIGtleTI6IGIsXG4gIGtleTM6IGMsXG4gIGtleTQ6IGQsXG4gIGtleTU6IGVcbik6IChzb3VyY2UkOiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlPFRbYV1bYl1bY11bZF1bZV0+O1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdDxcbiAgVCxcbiAgYSBleHRlbmRzIGtleW9mIFQsXG4gIGIgZXh0ZW5kcyBrZXlvZiBUW2FdLFxuICBjIGV4dGVuZHMga2V5b2YgVFthXVtiXSxcbiAgZCBleHRlbmRzIGtleW9mIFRbYV1bYl1bY10sXG4gIGUgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdW2NdW2RdLFxuICBmIGV4dGVuZHMga2V5b2YgVFthXVtiXVtjXVtkXVtlXVxuPihcbiAga2V5MTogYSxcbiAga2V5MjogYixcbiAga2V5MzogYyxcbiAga2V5NDogZCxcbiAga2V5NTogZSxcbiAga2V5NjogZlxuKTogKHNvdXJjZSQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8VFthXVtiXVtjXVtkXVtlXVtmXT47XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0PFxuICBULFxuICBhIGV4dGVuZHMga2V5b2YgVCxcbiAgYiBleHRlbmRzIGtleW9mIFRbYV0sXG4gIGMgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdLFxuICBkIGV4dGVuZHMga2V5b2YgVFthXVtiXVtjXSxcbiAgZSBleHRlbmRzIGtleW9mIFRbYV1bYl1bY11bZF0sXG4gIGYgZXh0ZW5kcyBrZXlvZiBUW2FdW2JdW2NdW2RdW2VdLFxuICBLID0gYW55XG4+KFxuICBrZXkxOiBhLFxuICBrZXkyOiBiLFxuICBrZXkzOiBjLFxuICBrZXk0OiBkLFxuICBrZXk1OiBlLFxuICBrZXk2OiBmLFxuICAuLi5wYXRoczogc3RyaW5nW11cbik6IChzb3VyY2UkOiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlPEs+O1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdDxULCBQcm9wcywgSz4oXG4gIHBhdGhPck1hcEZuOiAoKHN0YXRlOiBULCBwcm9wcz86IFByb3BzKSA9PiBhbnkpIHwgc3RyaW5nLFxuICBwcm9wc09yUGF0aD86IFByb3BzIHwgc3RyaW5nLFxuICAuLi5wYXRoczogc3RyaW5nW11cbikge1xuICByZXR1cm4gZnVuY3Rpb24gc2VsZWN0T3BlcmF0b3Ioc291cmNlJDogT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8Sz4ge1xuICAgIGxldCBtYXBwZWQkOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgICBpZiAodHlwZW9mIHBhdGhPck1hcEZuID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgcGF0aFNsaWNlcyA9IFs8c3RyaW5nPnByb3BzT3JQYXRoLCAuLi5wYXRoc10uZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgbWFwcGVkJCA9IHNvdXJjZSQucGlwZShwbHVjayhwYXRoT3JNYXBGbiwgLi4ucGF0aFNsaWNlcykpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdGhPck1hcEZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtYXBwZWQkID0gc291cmNlJC5waXBlKFxuICAgICAgICBtYXAoKHNvdXJjZSkgPT4gcGF0aE9yTWFwRm4oc291cmNlLCA8UHJvcHM+cHJvcHNPclBhdGgpKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYFVuZXhwZWN0ZWQgdHlwZSAnJHt0eXBlb2YgcGF0aE9yTWFwRm59JyBpbiBzZWxlY3Qgb3BlcmF0b3IsYCArXG4gICAgICAgICAgYCBleHBlY3RlZCAnc3RyaW5nJyBvciAnZnVuY3Rpb24nYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFwcGVkJC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICB9O1xufVxuIl19