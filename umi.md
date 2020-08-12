1. 在effect中使用 yield 可一定程度保证代码串行/同步执行，但有些情况是保证不了的；以下面的代码为例：init1能保证fetchSystemInfo的请求返回后再执行fetchUserInfo，而init2不能
> *init1(action, { put }) {
>   const res = yield call(Server.fetchSystemInfo)
>   const res = yield call(Server.fetchUserInfo)
> }

> *init2(action, { put }) {
>   yield put({ type: 'fetchSystemInfo' })
>   yield put({ type: 'fetchUserInfo' })
> }

> *fetchSystemInfo(action, { call }) {
>   yield call(Server.fetchSystemInfo)
> }

> *fetchUserInfo(action, { call }) {
>   yield call(Server.fetchUserInfo)
> }
