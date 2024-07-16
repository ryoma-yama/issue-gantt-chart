import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Multiselect } from 'multiselect-react-dropdown';
import Autocomplete from '@mui/material/Autocomplete';
import GitHubIcon from '@mui/icons-material/GitHub';
import { gantt } from 'dhtmlx-gantt';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { bake_cookie } from 'sfcookies';

const PREFIX = 'Toolbar';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled('form')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    '& > *': {
      fontSize: '13px',
      marginRight: '4px',
    },
  }
}));

const Toolbar = (props) => {
  return (
    <Root noValidate>
      <IconButton
        color="primary"
        style={{ verticalAlign: 'middle' }}
        size="large"
        onClick={(e) => {
          gantt.config.show_grid = !gantt.config.show_grid;
          bake_cookie('menu_opened', gantt.config.show_grid);
          gantt.render();
        }}
      >
        <MenuOpenIcon />
      </IconButton>
      <TextField
        className={classes.root}
        required
        placeholder="https://github.com/lamact/react-issue-ganttchart"
        label="Git Repository URL"
        style={{ width: '20%', verticalAlign: 'middle' }}
        onChange={(e) => {
          props.onGitURLChange(e.target.value);
        }}
        {...props.register("git_url")}
        name="git_url"
      />
      <TextField
        className={classes.root}
        type="password"
        placeholder="Access Token"
        label="Access Token"
        style={{ width: '10%', verticalAlign: 'middle' }}
        onChange={(e) => {
          props.onTokenChange(e.target.value);
        }}
        {...props.register("token")}
        name="token"
      />
      <Multiselect
        className={classes.root}
        options={props.labels}
        selectedValues={props.selected_labels}
        onSelect={(options) => {
          props.onSelectedLabelChange(options);
        }}
        onRemove={(options) => {
          props.onSelectedLabelChange(options);
        }}
        displayValue="name"
        style={selector_style}
        placeholder="filter by labels"
        hidePlaceholder="false"
        emptyRecordMsg="No Labels"
        closeIcon="cancel"
      />
      <Autocomplete
        className={classes.root}
        size="small"
        options={props.member_list}
        getOptionLabel={(option) => option && option.name ? option.name : ""}
        value={props.selected_assignee}
        noOptionsText="Requires a valid token"
        onChange={(e, assignee) => {
          props.onSelectedAssigneeChange(assignee);
        }}
        style={{
          width: '15%',
          verticalAlign: 'middle',
          display: 'inline-block',
          marginRight: '15px',
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className={classes.root}
            label="Assignee"
            variant="standard"
          />
        )}
      />
      <ButtonGroup size="small" style={{ height: '34px' }}>
        <Button
          onClick={(e) => {
            props.onZoomChange('Years');
          }}
        >
          Years
        </Button>
        <Button
          onClick={(e) => {
            props.onZoomChange('Weeks');
          }}
        >
          Weeks
        </Button>
        <Button
          onClick={(e) => {
            props.onZoomChange('Days');
          }}
        >
          Days
        </Button>
      </ButtonGroup>
      <IconButton
        color="primary"
        style={{ verticalAlign: 'middle' }}
        size="large"
        onClick={() => window.open('https://github.com/lamact/react-issue-ganttchart')}
      >
        <GitHubIcon />
      </IconButton>
    </Root>
  );
};

const selector_style = {
  multiselectContainer: {
    width: '27%',
    display: 'inline-block',
    verticalAlign: 'middle',
    padding: '4px',
    alignItems: 'flex-end',
  },
  chips: {
    background: 'light blue',
    fontSize: '15px',
  },
  searchBox: {
    border: 'none',
  },
};

export default Toolbar;
