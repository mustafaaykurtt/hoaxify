import React, { useEffect, useState } from 'react'
import { getUsers, setAuthorizationHeader } from '../api/apiCalls';
import { useTranslation } from 'react-i18next';
import UserListItem from './UserListItem';
import { useSelector } from 'react-redux';
import { useApiProgress } from '../shared/ApiProgress';
import { Spinner } from 'react-bootstrap';

const UserList = () => {

  const [page, setPage] = useState({
    content: [],
    size: 3,
    number: 0
  });
  const { t } = useTranslation();
  const { username, password, isLoggedIn } = useSelector(state => state.user);

  const pendingApiCall = useApiProgress('get', '/api/1.0/users?page')
  const [loadFailure, setLoadFailure] = useState(false);

  useEffect(() => {
    setAuthorizationHeader(username, password, isLoggedIn);
    loadUsers();
  }, [username, password, isLoggedIn])

  const onClickNext = () => {
    const nextPage = page.number + 1;
    loadUsers(nextPage);
  }

  const onClickPrev = () => {
    const previousPage = page.number - 1;
    loadUsers(previousPage);
  }

  const loadUsers = async page => {
    setLoadFailure(false)
    try {
      const response = await getUsers(page);
      setPage(response.data);
    } catch (error) {
      setLoadFailure(true);
    }
  }

  const { content: users, first, last } = page;

  let actionDiv = (
    <div className='d-flex justify-content-between'>
      <div>
        {first === false && <button className='btn btn-sm btn-light ml-auto' onClick={onClickPrev}>
          {t("Previous")}
        </button>}
      </div>
      <div>
        {last === false && <button className='btn btn-sm btn-light float-right' onClick={onClickNext}>
          {t("Next")}
        </button>}
      </div>
    </div>
  )

  if (pendingApiCall) {
    actionDiv = (
      <div className='d-flex justify-content-center'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='card'>
      <h3 className='card-header text-center'>{t("Users")}</h3>
      <div className='list-group'>
        {users.map((user) =>
          <UserListItem key={user.username} user={user} />
        )}
      </div>
      {actionDiv}
      {loadFailure && <div className='text-center text-danger'>{t("Load Failure")}</div>}
    </div>
  )
}

export default UserList