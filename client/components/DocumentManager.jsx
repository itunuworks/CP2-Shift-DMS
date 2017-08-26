import React from 'react';
import PropType from 'prop-types';
import toastr from 'toastr';
import lodash from 'lodash';
import classNames from 'classnames';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import RoleSearchComponent from '../components/RoleSearchComponent';
import documentActions from '../actions/documentActions';

const {
  saveNewDocument,
  modifyDocument,
  cancelNewDocument
} = documentActions;

const editModes = {
  READ: 'READ',
  WRITE: 'WRITE',
  NEW: 'NEW'
};

toastr.options = {
  positionClass: 'toast-top-center',
  showMethod: 'slideDown',
  timeOut: 2000
};

/**
 * A React component that displays and creates
 * an environment to modify documents
 *
 * @export DocumentManager
 * @class DocumentManager
 * @extends {React.Component}
 */
export class DocumentManager extends React.Component {
  /**
   * Creates an instance of DocumentManager.
   * @param {any} props
   * @memberof DocumentManager
   */
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      accessId: 2,
      rightId: 3, // Read access
      accessMode: this.props.createNew ?
       editModes.NEW : editModes.READ,
      selectedRoles: []
    };
    this.onChange = this.onChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.editDocument = this.editDocument.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
    this.cancelNewDocument = this.cancelNewDocument.bind(this);
    this.onRolesChange = this.onRolesChange.bind(this);
  }

  componentDidMount() {
    tinymce.init({
      selector: '.tinymcepanel',
      init_instance_callback: (editor) => {
        editor.on('keyup', () => {
          this.setState({
            content: editor.getContent()
          });
        });
        editor.on('undo', () => {
          this.setState({
            content: editor.getContent()
          });
        });
        editor.on('redo', () => {
          this.setState({
            content: editor.getContent()
          });
        });
        editor.on('Change', () => {
          this.setState({
            content: editor.getContent()
          });
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentDocument, createNew, currentDocumentRoles, rightId
    } = nextProps;

    if (currentDocument || createNew) {
      this.setState({
        rightId,
        selectedRoles: currentDocumentRoles,
        accessMode: createNew ?
          editModes.NEW : editModes.READ,
      }, () => {
        const isNew = createNew;

        this.setState({
          title: isNew ? '' : currentDocument.title,
          content: isNew ? '' : currentDocument.content,
          accessId: isNew ? 2 : currentDocument.accessId
        }, () => {
          tinymce.activeEditor.setContent(this.state.content);
        });
      });
    }
  }

  /**
   * Changes the selected role in the Component state
   * @method onRolesChange
   *
   * @param {any} event
   * @param {any} data
   * @memberof DocumentManager
   * @returns {void}
   */
  onRolesChange(event, data) {
    this.setState({
      selectedRoles: data.value
    });
  }

  /**
   * Sets the Component state based on changes in its textboxes
   * @method onChange
   *
   * @param {any} event
   * @memberof DocumentManager
   * @returns {void}
   */
  onChange(event) {
    event.preventDefault();
    this.setState(event.target.name !== 'title' ?
      { content: event.target.getContent() } :
      { [event.target.name]: event.target.value }
    );
  }

  /**
   * Sets the document Types state based on radio button selection change
   * @method handleRadioButtonChange
   *
   * @param {any} event
   * @param {any} eventData
   * @memberof DocumentManager
   * @returns {void}
   */
  handleRadioButtonChange(event, { value }) {
    if (value === 3) {
      this.setState({ accessId: parseInt(value, 10) });
    } else {
      this.setState({
        accessId: parseInt(value, 10),
        selectedRoles: [this.props.user.roleId]
      });
    }
  }

  /**
   * Saves the currentDocument
   * @method saveDocument
   *
   * @param {any} event
   * @memberof DocumentManager
   * @returns {void}
   */
  saveDocument(event) {
    const { currentDocument } = this.props;
    event.preventDefault();
    if (this.state.accessMode === editModes.NEW) {
      this.props.saveNewDocument({
        title: this.state.title,
        content: this.state.content,
        ownerId: this.props.user.id,
        accessId: this.state.accessId,
        roles: lodash.reduce(this.state.selectedRoles, (cummulator, value) => {
          if (value !== this.props.user.roleId) {
            cummulator[value] = 3;
          }
          return cummulator;
        }, {})
      });
    } else {
      const editData = {};
      if (this.state.title !== currentDocument.title) {
        editData.title = this.state.title;
      }
      if (this.state.content !== currentDocument.content) {
        editData.content = this.state.content;
      }
      if (this.state.accessId !== currentDocument.accessId ||
        this.state.accessId === 3) {
        editData.accessId = this.state.accessId;
        if (this.state.accessId === 3) {
          editData.roles =
            lodash.reduce(this.state.selectedRoles, (cummulator, value) => {
              cummulator[value] = 3;
              return cummulator;
            }, {});
        }
      }
      this.props.modifyDocument(currentDocument.id, editData);
    }
  }

  /**
   * Sets the current document to Edit Mode
   * @method editDocument
   *
   * @param {any} event
   * @memberof DocumentManager
   * @memberof DocumentManager
   * @returns {void}
   */
  editDocument(event) {
    event.preventDefault();
    if (this.props.rightId < 3) {
      this.setState({
        accessMode: editModes.WRITE
      }, () => {
        tinymce.activeEditor.setContent(this.state.content);
      });
    }
  }

  /**
   * Close the currently open document
   * @method cancelNewDocument
   *
   * @param {any} event
   * @memberof DocumentManager
   * @returns {void}
   */
  cancelNewDocument(event) {
    event.preventDefault();
    this.props.cancelNewDocument();
  }

  /**
   * @method render
   *
   * @returns {void}
   * @memberof DocumentManager
   */
  render() {
    const { accessId } = this.state;
    return (
      <div className="ui longer fullscreen document modal documentManager">
        <div className="header">
          <div className="ui container intro">
            {this.props.createNew ?
            'Create your document here' :
            this.state.title}
          </div>
        </div>
        <div
          className="ui container"
        >
          <div
            className={classNames('ui form', (
              this.state.accessMode === editModes.WRITE ||
              this.state.accessMode === editModes.NEW
            ) ? 'visible-block' : 'not-visible')}
          >
            <div className="field">
              <textarea
                rows="1"
                placeholder="Title"
                name="title"
                onChange={this.onChange}
                value={this.state.title}
              />
            </div>
            <div
              className={classNames('two fields roleManagement', (
                this.props.user.role === 'overlord' || (
                  this.props.currentDocument && (
                  this.props.user.id !== this.props.currentDocument.ownerId)
                )) ?
                'not-visible' : 'visible-block')}
            >
              <Form.Field width={3}>
                <Form.Field>
                  <Checkbox
                    radio
                    id="private"
                    label="Private"
                    name="accessRadioGroup"
                    checked={accessId === 1}
                    value="1"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    radio
                    id="public"
                    label="Public"
                    name="accessRadioGroup"
                    checked={accessId === 2}
                    value="2"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    radio
                    id="shared"
                    label="Shared"
                    name="accessRadioGroup"
                    checked={accessId === 3}
                    value="3"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
              </Form.Field>
              <Form.Field disabled={accessId !== 3} width={13}>
                <RoleSearchComponent
                  fluid
                  roles={this.props.user.roles}
                  onChange={this.onRolesChange}
                  selectedRoles={this.state.selectedRoles}
                />
              </Form.Field>
            </div>
            <div className="field">
              <textarea
                className="tinymcepanel"
              />
            </div>
          </div>
          <div
            className={
              classNames('scrolling content content-holder', (
                this.state.accessMode === editModes.READ) ?
                'visible-block' : 'not-visible')}
          >
            { ReactHtmlParser(this.state.content) }
          </div>
        </div>
        <div
          className="ui actions container"
        >
          <div
            className={classNames('ui primary edit icon button', (
              this.state.accessMode === editModes.READ) &&
                (this.state.rightId !== 3) ?
                'visible-inline-block' : 'not-visible')}
            onClick={this.editDocument}
          >
            <i className="edit icon" />
          </div>
          <div
            className={classNames('ui primary save icon button', (
              this.state.accessMode === editModes.READ) ?
              'not-visible' : 'visible-inline-block')}
            onClick={this.saveDocument}
          >
            <i className="save icon" />
          </div>
          <div
            className={classNames('ui cancel button', (
              this.state.accessMode !== editModes.READ) ?
              'visible-inline-block' : 'not-visible')}
            onClick={this.cancelNewDocument}
          >
            Cancel
          </div>
          <div
            className={classNames('ui close button', (
              this.state.accessMode === editModes.READ) ?
              'visible-inline-block' : 'not-visible')}
            onClick={this.cancelNewDocument}
          >
            Close
          </div>
        </div>
      </div>
    );
  }
}

DocumentManager.propTypes = {
  saveNewDocument: PropType.func.isRequired,
  user: PropType.shape({
    isAuthenticated: PropType.bool.isRequired,
    roles: PropType.arrayOf(PropType.object).isRequired,
    id: PropType.number.isRequired,
    email: PropType.string.isRequired,
    username: PropType.string.isRequired,
    firstname: PropType.string.isRequired,
    lastname: PropType.string.isRequired,
    result: PropType.string.isRequired,
    roleId: PropType.number.isRequired,
    role: PropType.string.isRequired
  }).isRequired,
  createNew: PropType.bool.isRequired,
  rightId: PropType.number.isRequired,
  currentDocumentRoles: PropType.arrayOf(PropType.number).isRequired,
  currentDocument: PropType.shape({
    id: PropType.number,
    title: PropType.string,
    content: PropType.string,
    ownerId: PropType.number,
    accessId: PropType.number
  }),
  cancelNewDocument: PropType.func.isRequired,
  modifyDocument: PropType.func.isRequired
};

DocumentManager.defaultProps = {
  currentDocument: null
};

const mapDispatchToProps = {
  saveNewDocument,
  cancelNewDocument,
  modifyDocument
};

/**
 * @function mapStateToProps
 *
 * @param {any} state
 * @return {object} props
 */
const mapStateToProps = state => ({
  user: state.user,
  currentDocument: state.documents.currentDocument,
  rightId: state.documents.currentRightId,
  currentDocumentRoles: state.documents.currentDocumentRoles
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManager);

