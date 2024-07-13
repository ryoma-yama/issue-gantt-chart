import React, { useReducer, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Toolbar from './components/Toolbar';
import Gantt from './components/Gantt';
import PageHeader from './components/PageHeader';
import { read_cookie } from 'sfcookies';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { initialState, reducerFunc } from './State/Reducer.js';
import {
  getIssuesFromAPI,
  setLabelListOfRepoFromAPI,
  setMemberListOfRepoFromAPI,
} from './functions/Common/IssueAPI.js';
import { gantt } from 'dhtmlx-gantt';

const App = () => {
  const [state, dispatch] = useReducer(reducerFunc, initialState);
  const { register, setValue } = useForm({ git_url: '', token: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setValue('token', read_cookie('git_token'));
    dispatch({ type: 'tokenChange', value: read_cookie('git_token') });

    // Set Zoom Level
    const zoom = read_cookie("zoom");
    if (zoom === "Days" || zoom === "Weeks" || zoom === "Years") {
      gantt.ext.zoom.setLevel(zoom);
    }

    // Set Menu Opened
    gantt.config.show_grid = read_cookie('menu_opened');
    gantt.render();
  }, [setValue]);

  useEffect(() => {
    dispatch({
      type: 'setStateFromURLQueryString',
      value: { props: { location }, setValue: setValue },
    });
  }, [location, setValue]);

  useEffect(() => {
    setLabelListOfRepoFromAPI(state.git_url, state.token)
      .then((labels) => {
        dispatch({ type: 'labelChange', value: labels });
      })
      .catch((err) => {
        gantt.message({ text: err, type: 'error' });
      });
    setMemberListOfRepoFromAPI(state.git_url, state.token)
      .then((members) => {
        dispatch({ type: 'memberListChange', value: members });
      })
      .catch((err) => {
        gantt.message({ text: err, type: 'error' });
      });
  }, [state.git_url, state.token, state.selected_assignee]);

  useEffect(() => {
    getIssuesFromAPI(
      state.git_url,
      state.token,
      state.selected_labels,
      state.selected_assignee
    )
      .then((issues) => {
        dispatch({ type: 'setIssue', value: issues });
      })
      .catch((err) => {
        console.log('error');
      });
  }, [
    state.git_url,
    state.token,
    state.selected_labels,
    state.selected_assignee,
  ]);

  return (
    <>
      <PageHeader title={state.title} />
      <div className="zoom-bar">
        <Toolbar
          zoom={state.currentZoom}
          onZoomChange={(zoom) => dispatch({ type: 'zoomChange', value: zoom })}
          onGitURLChange={(git_url) =>
            dispatch({
              type: 'gitURLChange',
              value: { props: { location }, git_url: git_url },
            })
          }
          token={state.token}
          onTokenChange={(token) =>
            dispatch({ type: 'tokenChange', value: token })
          }
          labels={state.labels}
          selected_labels={state.selected_labels}
          onSelectedLabelChange={(selected_labels) =>
            dispatch({
              type: 'selectedLabelsChange',
              value: { props: { location }, selected_labels: selected_labels },
            })
          }
          member_list={state.member_list}
          selected_assignee={state.selected_assignee}
          onSelectedAssigneeChange={(selected_assignee) =>
            dispatch({
              type: 'selectedAssigneeChange',
              value: { props: { location }, selected_assignee: selected_assignee },
            })
          }
          register={register}
        />
      </div>
      <div className="gantt-container">
        <Gantt
          zoom={state.currentZoom}
          git_url={state.git_url}
          token={state.token}
          selected_labels={state.selected_labels}
          selected_assignee={state.selected_assignee}
          issue={state.issue}
          openIssueAtBrowser={(gantt_task_id) =>
            dispatch({ type: 'openIssueAtBrowser', value: gantt_task_id })
          }
          openNewIssueAtBrowser={(gantt_task_id) =>
            dispatch({ type: 'openNewIssueAtBrowser', value: gantt_task_id })
          }
          updateIssueByAPI={(gantt_task, gantt) =>
            dispatch({
              type: 'updateIssueByAPI',
              value: { gantt_task: gantt_task, gantt: gantt },
            })
          }
        />
      </div>
    </>
  );
};

const MainApp = () => (
  <Routes>
    <Route path="/*" element={<App />} />
  </Routes>
);

export default MainApp;
