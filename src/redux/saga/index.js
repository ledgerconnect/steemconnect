import UserSaga from './UserSaga'

export default sagaMiddleware => {
  UserSaga(sagaMiddleware);
}
