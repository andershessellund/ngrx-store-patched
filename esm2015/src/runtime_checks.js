import { isDevMode } from '@angular/core';
import { serializationCheckMetaReducer, immutabilityCheckMetaReducer, inNgZoneAssertMetaReducer, } from './meta-reducers';
import { _USER_RUNTIME_CHECKS, ACTIVE_RUNTIME_CHECKS, META_REDUCERS, USER_RUNTIME_CHECKS, _ACTION_TYPE_UNIQUENESS_CHECK, } from './tokens';
import { REGISTERED_ACTION_TYPES } from './globals';
import { RUNTIME_CHECK_URL } from './meta-reducers/utils';
export function createActiveRuntimeChecks(runtimeChecks) {
    if (isDevMode()) {
        return Object.assign({ strictStateSerializability: false, strictActionSerializability: false, strictStateImmutability: true, strictActionImmutability: true, strictActionWithinNgZone: false, strictActionTypeUniqueness: false }, runtimeChecks);
    }
    return {
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictActionWithinNgZone: false,
        strictActionTypeUniqueness: false,
    };
}
export function createSerializationCheckMetaReducer({ strictActionSerializability, strictStateSerializability, }) {
    return (reducer) => strictActionSerializability || strictStateSerializability
        ? serializationCheckMetaReducer(reducer, {
            action: (action) => strictActionSerializability && !ignoreNgrxAction(action),
            state: () => strictStateSerializability,
        })
        : reducer;
}
export function createImmutabilityCheckMetaReducer({ strictActionImmutability, strictStateImmutability, }) {
    return (reducer) => strictActionImmutability || strictStateImmutability
        ? immutabilityCheckMetaReducer(reducer, {
            action: (action) => strictActionImmutability && !ignoreNgrxAction(action),
            state: () => strictStateImmutability,
        })
        : reducer;
}
function ignoreNgrxAction(action) {
    return action.type.startsWith('@ngrx');
}
export function createInNgZoneCheckMetaReducer({ strictActionWithinNgZone, }) {
    return (reducer) => strictActionWithinNgZone
        ? inNgZoneAssertMetaReducer(reducer, {
            action: (action) => strictActionWithinNgZone && !ignoreNgrxAction(action),
        })
        : reducer;
}
export function provideRuntimeChecks(runtimeChecks) {
    return [
        {
            provide: _USER_RUNTIME_CHECKS,
            useValue: runtimeChecks,
        },
        {
            provide: USER_RUNTIME_CHECKS,
            useFactory: _runtimeChecksFactory,
            deps: [_USER_RUNTIME_CHECKS],
        },
        {
            provide: ACTIVE_RUNTIME_CHECKS,
            deps: [USER_RUNTIME_CHECKS],
            useFactory: createActiveRuntimeChecks,
        },
        {
            provide: META_REDUCERS,
            multi: true,
            deps: [ACTIVE_RUNTIME_CHECKS],
            useFactory: createImmutabilityCheckMetaReducer,
        },
        {
            provide: META_REDUCERS,
            multi: true,
            deps: [ACTIVE_RUNTIME_CHECKS],
            useFactory: createSerializationCheckMetaReducer,
        },
        {
            provide: META_REDUCERS,
            multi: true,
            deps: [ACTIVE_RUNTIME_CHECKS],
            useFactory: createInNgZoneCheckMetaReducer,
        },
    ];
}
export function checkForActionTypeUniqueness() {
    return [
        {
            provide: _ACTION_TYPE_UNIQUENESS_CHECK,
            multi: true,
            deps: [ACTIVE_RUNTIME_CHECKS],
            useFactory: _actionTypeUniquenessCheck,
        },
    ];
}
export function _runtimeChecksFactory(runtimeChecks) {
    return runtimeChecks;
}
export function _actionTypeUniquenessCheck(config) {
    if (!config.strictActionTypeUniqueness) {
        return;
    }
    const duplicates = Object.entries(REGISTERED_ACTION_TYPES)
        .filter(([, registrations]) => registrations > 1)
        .map(([type]) => type);
    if (duplicates.length) {
        throw new Error(`Action types are registered more than once, ${duplicates
            .map((type) => `"${type}"`)
            .join(', ')}. ${RUNTIME_CHECK_URL}#strictactiontypeuniqueness`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9jaGVja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlL3NyYy9ydW50aW1lX2NoZWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFDTCw2QkFBNkIsRUFDN0IsNEJBQTRCLEVBQzVCLHlCQUF5QixHQUMxQixNQUFNLGlCQUFpQixDQUFDO0FBRXpCLE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIscUJBQXFCLEVBQ3JCLGFBQWEsRUFDYixtQkFBbUIsRUFDbkIsNkJBQTZCLEdBQzlCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxNQUFNLFVBQVUseUJBQXlCLENBQ3ZDLGFBQXNDO0lBRXRDLElBQUksU0FBUyxFQUFFLEVBQUU7UUFDZix1QkFDRSwwQkFBMEIsRUFBRSxLQUFLLEVBQ2pDLDJCQUEyQixFQUFFLEtBQUssRUFDbEMsdUJBQXVCLEVBQUUsSUFBSSxFQUM3Qix3QkFBd0IsRUFBRSxJQUFJLEVBQzlCLHdCQUF3QixFQUFFLEtBQUssRUFDL0IsMEJBQTBCLEVBQUUsS0FBSyxJQUM5QixhQUFhLEVBQ2hCO0tBQ0g7SUFFRCxPQUFPO1FBQ0wsMEJBQTBCLEVBQUUsS0FBSztRQUNqQywyQkFBMkIsRUFBRSxLQUFLO1FBQ2xDLHVCQUF1QixFQUFFLEtBQUs7UUFDOUIsd0JBQXdCLEVBQUUsS0FBSztRQUMvQix3QkFBd0IsRUFBRSxLQUFLO1FBQy9CLDBCQUEwQixFQUFFLEtBQUs7S0FDbEMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUsbUNBQW1DLENBQUMsRUFDbEQsMkJBQTJCLEVBQzNCLDBCQUEwQixHQUNaO0lBQ2QsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQ2pCLDJCQUEyQixJQUFJLDBCQUEwQjtRQUN2RCxDQUFDLENBQUMsNkJBQTZCLENBQUMsT0FBTyxFQUFFO1lBQ3JDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ2pCLDJCQUEyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO1lBQzFELEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQywwQkFBMEI7U0FDeEMsQ0FBQztRQUNKLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxFQUNqRCx3QkFBd0IsRUFDeEIsdUJBQXVCLEdBQ1Q7SUFDZCxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FDakIsd0JBQXdCLElBQUksdUJBQXVCO1FBQ2pELENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLEVBQUU7WUFDcEMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDakIsd0JBQXdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7WUFDdkQsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLHVCQUF1QjtTQUNyQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFjO0lBQ3RDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVELE1BQU0sVUFBVSw4QkFBOEIsQ0FBQyxFQUM3Qyx3QkFBd0IsR0FDVjtJQUNkLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUNqQix3QkFBd0I7UUFDdEIsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLE9BQU8sRUFBRTtZQUNqQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUNqQix3QkFBd0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztTQUN4RCxDQUFDO1FBQ0osQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNoQixDQUFDO0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUNsQyxhQUFzQztJQUV0QyxPQUFPO1FBQ0w7WUFDRSxPQUFPLEVBQUUsb0JBQW9CO1lBQzdCLFFBQVEsRUFBRSxhQUFhO1NBQ3hCO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsSUFBSSxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDN0I7UUFDRDtZQUNFLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUM7WUFDM0IsVUFBVSxFQUFFLHlCQUF5QjtTQUN0QztRQUNEO1lBQ0UsT0FBTyxFQUFFLGFBQWE7WUFDdEIsS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUM3QixVQUFVLEVBQUUsa0NBQWtDO1NBQy9DO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsYUFBYTtZQUN0QixLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxDQUFDLHFCQUFxQixDQUFDO1lBQzdCLFVBQVUsRUFBRSxtQ0FBbUM7U0FDaEQ7UUFDRDtZQUNFLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUM7WUFDN0IsVUFBVSxFQUFFLDhCQUE4QjtTQUMzQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLDRCQUE0QjtJQUMxQyxPQUFPO1FBQ0w7WUFDRSxPQUFPLEVBQUUsNkJBQTZCO1lBQ3RDLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUM7WUFDN0IsVUFBVSxFQUFFLDBCQUEwQjtTQUN2QztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUNuQyxhQUE0QjtJQUU1QixPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQsTUFBTSxVQUFVLDBCQUEwQixDQUFDLE1BQXFCO0lBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUU7UUFDdEMsT0FBTztLQUNSO0lBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztTQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7U0FDaEQsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFekIsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQ2IsK0NBQStDLFVBQVU7YUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO2FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxpQkFBaUIsNkJBQTZCLENBQ2pFLENBQUM7S0FDSDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0Rldk1vZGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBzZXJpYWxpemF0aW9uQ2hlY2tNZXRhUmVkdWNlcixcbiAgaW1tdXRhYmlsaXR5Q2hlY2tNZXRhUmVkdWNlcixcbiAgaW5OZ1pvbmVBc3NlcnRNZXRhUmVkdWNlcixcbn0gZnJvbSAnLi9tZXRhLXJlZHVjZXJzJztcbmltcG9ydCB7IFJ1bnRpbWVDaGVja3MsIE1ldGFSZWR1Y2VyLCBBY3Rpb24gfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQge1xuICBfVVNFUl9SVU5USU1FX0NIRUNLUyxcbiAgQUNUSVZFX1JVTlRJTUVfQ0hFQ0tTLFxuICBNRVRBX1JFRFVDRVJTLFxuICBVU0VSX1JVTlRJTUVfQ0hFQ0tTLFxuICBfQUNUSU9OX1RZUEVfVU5JUVVFTkVTU19DSEVDSyxcbn0gZnJvbSAnLi90b2tlbnMnO1xuaW1wb3J0IHsgUkVHSVNURVJFRF9BQ1RJT05fVFlQRVMgfSBmcm9tICcuL2dsb2JhbHMnO1xuaW1wb3J0IHsgUlVOVElNRV9DSEVDS19VUkwgfSBmcm9tICcuL21ldGEtcmVkdWNlcnMvdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aXZlUnVudGltZUNoZWNrcyhcbiAgcnVudGltZUNoZWNrcz86IFBhcnRpYWw8UnVudGltZUNoZWNrcz5cbik6IFJ1bnRpbWVDaGVja3Mge1xuICBpZiAoaXNEZXZNb2RlKCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RyaWN0U3RhdGVTZXJpYWxpemFiaWxpdHk6IGZhbHNlLFxuICAgICAgc3RyaWN0QWN0aW9uU2VyaWFsaXphYmlsaXR5OiBmYWxzZSxcbiAgICAgIHN0cmljdFN0YXRlSW1tdXRhYmlsaXR5OiB0cnVlLFxuICAgICAgc3RyaWN0QWN0aW9uSW1tdXRhYmlsaXR5OiB0cnVlLFxuICAgICAgc3RyaWN0QWN0aW9uV2l0aGluTmdab25lOiBmYWxzZSxcbiAgICAgIHN0cmljdEFjdGlvblR5cGVVbmlxdWVuZXNzOiBmYWxzZSxcbiAgICAgIC4uLnJ1bnRpbWVDaGVja3MsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RyaWN0U3RhdGVTZXJpYWxpemFiaWxpdHk6IGZhbHNlLFxuICAgIHN0cmljdEFjdGlvblNlcmlhbGl6YWJpbGl0eTogZmFsc2UsXG4gICAgc3RyaWN0U3RhdGVJbW11dGFiaWxpdHk6IGZhbHNlLFxuICAgIHN0cmljdEFjdGlvbkltbXV0YWJpbGl0eTogZmFsc2UsXG4gICAgc3RyaWN0QWN0aW9uV2l0aGluTmdab25lOiBmYWxzZSxcbiAgICBzdHJpY3RBY3Rpb25UeXBlVW5pcXVlbmVzczogZmFsc2UsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXJpYWxpemF0aW9uQ2hlY2tNZXRhUmVkdWNlcih7XG4gIHN0cmljdEFjdGlvblNlcmlhbGl6YWJpbGl0eSxcbiAgc3RyaWN0U3RhdGVTZXJpYWxpemFiaWxpdHksXG59OiBSdW50aW1lQ2hlY2tzKTogTWV0YVJlZHVjZXIge1xuICByZXR1cm4gKHJlZHVjZXIpID0+XG4gICAgc3RyaWN0QWN0aW9uU2VyaWFsaXphYmlsaXR5IHx8IHN0cmljdFN0YXRlU2VyaWFsaXphYmlsaXR5XG4gICAgICA/IHNlcmlhbGl6YXRpb25DaGVja01ldGFSZWR1Y2VyKHJlZHVjZXIsIHtcbiAgICAgICAgICBhY3Rpb246IChhY3Rpb24pID0+XG4gICAgICAgICAgICBzdHJpY3RBY3Rpb25TZXJpYWxpemFiaWxpdHkgJiYgIWlnbm9yZU5ncnhBY3Rpb24oYWN0aW9uKSxcbiAgICAgICAgICBzdGF0ZTogKCkgPT4gc3RyaWN0U3RhdGVTZXJpYWxpemFiaWxpdHksXG4gICAgICAgIH0pXG4gICAgICA6IHJlZHVjZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbW11dGFiaWxpdHlDaGVja01ldGFSZWR1Y2VyKHtcbiAgc3RyaWN0QWN0aW9uSW1tdXRhYmlsaXR5LFxuICBzdHJpY3RTdGF0ZUltbXV0YWJpbGl0eSxcbn06IFJ1bnRpbWVDaGVja3MpOiBNZXRhUmVkdWNlciB7XG4gIHJldHVybiAocmVkdWNlcikgPT5cbiAgICBzdHJpY3RBY3Rpb25JbW11dGFiaWxpdHkgfHwgc3RyaWN0U3RhdGVJbW11dGFiaWxpdHlcbiAgICAgID8gaW1tdXRhYmlsaXR5Q2hlY2tNZXRhUmVkdWNlcihyZWR1Y2VyLCB7XG4gICAgICAgICAgYWN0aW9uOiAoYWN0aW9uKSA9PlxuICAgICAgICAgICAgc3RyaWN0QWN0aW9uSW1tdXRhYmlsaXR5ICYmICFpZ25vcmVOZ3J4QWN0aW9uKGFjdGlvbiksXG4gICAgICAgICAgc3RhdGU6ICgpID0+IHN0cmljdFN0YXRlSW1tdXRhYmlsaXR5LFxuICAgICAgICB9KVxuICAgICAgOiByZWR1Y2VyO1xufVxuXG5mdW5jdGlvbiBpZ25vcmVOZ3J4QWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gIHJldHVybiBhY3Rpb24udHlwZS5zdGFydHNXaXRoKCdAbmdyeCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW5OZ1pvbmVDaGVja01ldGFSZWR1Y2VyKHtcbiAgc3RyaWN0QWN0aW9uV2l0aGluTmdab25lLFxufTogUnVudGltZUNoZWNrcyk6IE1ldGFSZWR1Y2VyIHtcbiAgcmV0dXJuIChyZWR1Y2VyKSA9PlxuICAgIHN0cmljdEFjdGlvbldpdGhpbk5nWm9uZVxuICAgICAgPyBpbk5nWm9uZUFzc2VydE1ldGFSZWR1Y2VyKHJlZHVjZXIsIHtcbiAgICAgICAgICBhY3Rpb246IChhY3Rpb24pID0+XG4gICAgICAgICAgICBzdHJpY3RBY3Rpb25XaXRoaW5OZ1pvbmUgJiYgIWlnbm9yZU5ncnhBY3Rpb24oYWN0aW9uKSxcbiAgICAgICAgfSlcbiAgICAgIDogcmVkdWNlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVSdW50aW1lQ2hlY2tzKFxuICBydW50aW1lQ2hlY2tzPzogUGFydGlhbDxSdW50aW1lQ2hlY2tzPlxuKTogUHJvdmlkZXJbXSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogX1VTRVJfUlVOVElNRV9DSEVDS1MsXG4gICAgICB1c2VWYWx1ZTogcnVudGltZUNoZWNrcyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFVTRVJfUlVOVElNRV9DSEVDS1MsXG4gICAgICB1c2VGYWN0b3J5OiBfcnVudGltZUNoZWNrc0ZhY3RvcnksXG4gICAgICBkZXBzOiBbX1VTRVJfUlVOVElNRV9DSEVDS1NdLFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogQUNUSVZFX1JVTlRJTUVfQ0hFQ0tTLFxuICAgICAgZGVwczogW1VTRVJfUlVOVElNRV9DSEVDS1NdLFxuICAgICAgdXNlRmFjdG9yeTogY3JlYXRlQWN0aXZlUnVudGltZUNoZWNrcyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1FVEFfUkVEVUNFUlMsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIGRlcHM6IFtBQ1RJVkVfUlVOVElNRV9DSEVDS1NdLFxuICAgICAgdXNlRmFjdG9yeTogY3JlYXRlSW1tdXRhYmlsaXR5Q2hlY2tNZXRhUmVkdWNlcixcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1FVEFfUkVEVUNFUlMsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIGRlcHM6IFtBQ1RJVkVfUlVOVElNRV9DSEVDS1NdLFxuICAgICAgdXNlRmFjdG9yeTogY3JlYXRlU2VyaWFsaXphdGlvbkNoZWNrTWV0YVJlZHVjZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBNRVRBX1JFRFVDRVJTLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBkZXBzOiBbQUNUSVZFX1JVTlRJTUVfQ0hFQ0tTXSxcbiAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZUluTmdab25lQ2hlY2tNZXRhUmVkdWNlcixcbiAgICB9LFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tGb3JBY3Rpb25UeXBlVW5pcXVlbmVzcygpOiBQcm92aWRlcltdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBfQUNUSU9OX1RZUEVfVU5JUVVFTkVTU19DSEVDSyxcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgZGVwczogW0FDVElWRV9SVU5USU1FX0NIRUNLU10sXG4gICAgICB1c2VGYWN0b3J5OiBfYWN0aW9uVHlwZVVuaXF1ZW5lc3NDaGVjayxcbiAgICB9LFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX3J1bnRpbWVDaGVja3NGYWN0b3J5KFxuICBydW50aW1lQ2hlY2tzOiBSdW50aW1lQ2hlY2tzXG4pOiBSdW50aW1lQ2hlY2tzIHtcbiAgcmV0dXJuIHJ1bnRpbWVDaGVja3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfYWN0aW9uVHlwZVVuaXF1ZW5lc3NDaGVjayhjb25maWc6IFJ1bnRpbWVDaGVja3MpOiB2b2lkIHtcbiAgaWYgKCFjb25maWcuc3RyaWN0QWN0aW9uVHlwZVVuaXF1ZW5lc3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBkdXBsaWNhdGVzID0gT2JqZWN0LmVudHJpZXMoUkVHSVNURVJFRF9BQ1RJT05fVFlQRVMpXG4gICAgLmZpbHRlcigoWywgcmVnaXN0cmF0aW9uc10pID0+IHJlZ2lzdHJhdGlvbnMgPiAxKVxuICAgIC5tYXAoKFt0eXBlXSkgPT4gdHlwZSk7XG5cbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEFjdGlvbiB0eXBlcyBhcmUgcmVnaXN0ZXJlZCBtb3JlIHRoYW4gb25jZSwgJHtkdXBsaWNhdGVzXG4gICAgICAgIC5tYXAoKHR5cGUpID0+IGBcIiR7dHlwZX1cImApXG4gICAgICAgIC5qb2luKCcsICcpfS4gJHtSVU5USU1FX0NIRUNLX1VSTH0jc3RyaWN0YWN0aW9udHlwZXVuaXF1ZW5lc3NgXG4gICAgKTtcbiAgfVxufVxuIl19