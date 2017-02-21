import user from './user'

export default sagaMiddleware => {
  user(sagaMiddleware);
}
