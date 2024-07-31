import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { 
  Plugin, ButtonView, AccessibilityHelp, Alignment, Autoformat, AutoImage, AutoLink, Autosave, 
  BalloonToolbar, BlockQuote, Bold, CKBox, CKBoxImageEdit, CloudServices, Code, Essentials, 
  FindAndReplace, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, Highlight, 
  HorizontalLine, ImageBlock, ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize, 
  ImageStyle, ImageTextAlternative, ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, 
  LinkImage, List, ListProperties, Mention, PageBreak, Paragraph, PasteFromOffice, PictureEditing, 
  RemoveFormat, SelectAll, SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency, 
  SpecialCharactersEssentials, SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText, 
  Strikethrough, Subscript, Superscript, Table, TableCaption, TableCellProperties, TableColumnResize, 
  TableProperties, TableToolbar, TextTransformation, TodoList, Underline, Undo 
} from 'ckeditor5/src';
import {
  AIAssistant, CaseChange, Comments, DocumentOutline, ExportPdf, ExportWord, FormatPainter, ImportWord, 
  MultiLevelList, OpenAITextAdapter, Pagination, PasteFromOfficeEnhanced, PresenceList, 
  RealTimeCollaborativeComments, RealTimeCollaborativeEditing, RealTimeCollaborativeRevisionHistory, 
  RealTimeCollaborativeTrackChanges, RevisionHistory, SlashCommand, TableOfContents, Template, TrackChanges, 
  TrackChangesData
} from 'ckeditor5-premium-features/src';
import 'ckeditor5/build/ckeditor.css';
import 'ckeditor5-premium-features/build/ckeditor-premium-features.css';
import './App.css';

const LICENSE_KEY = '<YOUR_LICENSE_KEY>';
const AI_AUTH_TOKEN = '<YOUR_AI_AUTH_TOKEN>';
const AI_API_URL = '<YOUR_AI_API_URL>';
const CKBOX_TOKEN_URL = '<YOUR_CKBOX_TOKEN_URL>';
const UNIQUE_CHANNEL_PER_DOCUMENT = '<YOUR_UNIQUE_CHANNEL_PER_DOCUMENT>';
const CLOUD_SERVICES_TOKEN_URL = '<YOUR_CLOUD_SERVICES_TOKEN_URL>';
const CLOUD_SERVICES_WEBSOCKET_URL = '<YOUR_CLOUD_SERVICES_WEBSOCKET_URL>';

class AnnotationsSidebarToggler extends Plugin {
  static get requires() { return ['AnnotationsUIs']; }
  static get pluginName() { return 'AnnotationsSidebarToggler'; }

  init() {
    this.toggleButton = new ButtonView(this.editor.locale);
    const NON_COLLAPSE_ANNOTATION_ICON = '<svg viewBox="0 0 20 20"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"></path></svg>';
    const COLLAPSE_ANNOTATION_ICON = '<svg viewBox="0 0 20 20"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"/></svg>';

    const annotationsUIsPlugin = this.editor.plugins.get('AnnotationsUIs');
    const annotationsContainer = this.editor.config.get('sidebar.container');
    const sidebarContainer = annotationsContainer.parentElement;

    this.toggleButton.set({
      label: 'Toggle annotations sidebar',
      tooltip: 'Hide annotations sidebar',
      icon: COLLAPSE_ANNOTATION_ICON
    });

    this.toggleButton.on('execute', () => {
      annotationsContainer.classList.toggle('ck-hidden');
      if (annotationsContainer.classList.contains('ck-hidden')) {
        this.toggleButton.icon = NON_COLLAPSE_ANNOTATION_ICON;
        this.toggleButton.tooltip = 'Show annotations sidebar';
        annotationsUIsPlugin.switchTo('inline');
      } else {
        this.toggleButton.icon = COLLAPSE_ANNOTATION_ICON;
        this.toggleButton.tooltip = 'Hide annotations sidebar';
        annotationsUIsPlugin.switchTo('wideSidebar');
      }
      this.editor.editing.view.focus();
    });

    this.toggleButton.render();
    sidebarContainer.insertBefore(this.toggleButton.element, annotationsContainer);
  }

  destroy() {
    this.toggleButton.element.remove();
    return super.destroy();
  }
}

class DocumentOutlineToggler extends Plugin {
  static get pluginName() { return 'DocumentOutlineToggler'; }

  init() {
    this.toggleButton = new ButtonView(this.editor.locale);
    const DOCUMENT_OUTLINE_ICON = '<svg viewBox="0 0 20 20"><path d="M5 9.5a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 0 5 8H3.5a.5.5 0 0 0-.5.5V9a.5.5 0 0 0 .5.5H5Z"/><path d="M5.5 12a.5.5 0 0 1-.5.5H3.5A.5.5 0 0 1 3 12v-.5a.5.5 0 0 1 .5-.5H5a.5.5 0 0 1 .5.5v.5Z"/><path d="M5 6.5a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 0 5 5H3.5a.5.5 0 0 0-.5.5V6a.5.5 0 0 0 .5.5H5Z"/><path d="M2 19a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2Zm6-1.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H8v15Zm-1.5-15H2a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 .5.5h4.5v-15Z"/></svg>';
    const COLLAPSE_OUTLINE_ICON = '<svg viewBox="0 0 20 20"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"/></svg>';

    const documentOutlineContainer = this.editor.config.get('documentOutline.container');
    const sidebarContainer = documentOutlineContainer.parentElement;

    this.toggleButton.set({
      label: 'Toggle document outline',
      tooltip: 'Hide document outline',
      icon: COLLAPSE_OUTLINE_ICON
    });

    this.toggleButton.on('execute', () => {
      documentOutlineContainer.classList.toggle('ck-hidden');
      if (documentOutlineContainer.classList.contains('ck-hidden')) {
        this.toggleButton.icon = DOCUMENT_OUTLINE_ICON;
        this.toggleButton.tooltip = 'Show document outline';
      } else {
        this.toggleButton.icon = COLLAPSE_OUTLINE_ICON;
        this.toggleButton.tooltip = 'Hide document outline';
      }
      this.editor.editing.view.focus();
    });

    this.toggleButton.render();
    sidebarContainer.insertBefore(this.toggleButton.element, documentOutlineContainer);
  }

  destroy() {
    this.toggleButton.element.remove();
    return super.destroy();
  }
}

const App: React.FC = () => {
  const editorPresenceRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorMenuBarRef = useRef<HTMLDivElement>(null);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const editorOutlineRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorAnnotationsRef = useRef<HTMLDivElement>(null);
  const editorRevisionHistoryRef = useRef<HTMLDivElement>(null);
  const editorRevisionHistoryEditorRef = useRef<HTMLDivElement>(null);
  const editorRevisionHistorySidebarRef = useRef<HTMLDivElement>(null);

  const editorConfig = {
    plugins: [
      Essentials, Alignment, Autoformat, Bold, Italic, Strikethrough, Underline, Subscript, Superscript,
      Link, BlockQuote, Heading, Indent, IndentBlock, List, ListProperties, Paragraph, TextTransformation,
      CloudServices, RemoveFormat, SelectAll, FindAndReplace, AutoImage, ImageBlock, ImageCaption,
      ImageInsert, ImageResize, ImageStyle, ImageToolbar, ImageUpload, PasteFromOffice, PasteFromOfficeEnhanced,
      PictureEditing, Table, TableToolbar, TableProperties, TableColumnResize, TableCaption, TableCellProperties,
      FontBackgroundColor, FontColor, FontFamily, FontSize, Highlight, HorizontalLine, SpecialCharacters,
      SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials, SpecialCharactersLatin,
      SpecialCharactersMathematical, SpecialCharactersText, Autosave, RealTimeCollaborativeEditing, Comments,
      PresenceList, RealTimeCollaborativeComments, RealTimeCollaborativeTrackChanges, TrackChangesData,
      RealTimeCollaborativeRevisionHistory, SlashCommand, AIAssistant, OpenAITextAdapter, CaseChange,
      DocumentOutline, TableOfContents, Template, FormatPainter, ImportWord, ExportWord, ExportPdf,
      Pagination, PageBreak, MultiLevelList, TrackChanges, TrackChangesData, RevisionHistory,
      CKBox, CKBoxImageEdit, LinkImage, Mention, AutoLink, Code, AccessibilityHelp, AnnotationsSidebarToggler,
      DocumentOutlineToggler
    ],
    toolbar: {
      items: ['undo', 'redo', '|', 'heading', '|', 'alignment', '|', 'bold', 'italic', 'underline', 'strikethrough',
        'link', '|', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'blockQuote', 'insertTable',
        'imageUpload', 'codeBlock', 'mediaEmbed', '|', 'highlight', 'removeFormat', '|', 'specialCharacters',
        'horizontalLine', 'pageBreak', 'findAndReplace', 'selectAll', '|', 'caseChange', 'exportWord', 'exportPdf'
      ],
      shouldNotGroupWhenFull: true
    },
    sidebar: {
      container: editorAnnotationsRef.current!,
      annotations: {
        classes: [
          'ck-annotations__content-panel',
          'ck-annotations__container'
        ]
      }
    },
    presenceList: {
      container: editorPresenceRef.current!,
      classes: [
        'ck-collaboration__presence-list'
      ]
    },
    revisionHistory: {
      editorContainer: editorRevisionHistoryEditorRef.current!,
      sidebarContainer: editorRevisionHistorySidebarRef.current!
    },
    documentOutline: {
      container: editorOutlineRef.current!,
      toolbarContainer: editorMenuBarRef.current!,
      classes: [
        'ck-document-outline',
        'ck-document-outline__panel'
      ]
    },
    licenseKey: LICENSE_KEY
  };

  const [editorData, setEditorData] = useState('');

  return (
    <div className="App">
      <h2>CKEditor 5 React Integration with Typescript</h2>
      <div ref={editorMenuBarRef} className="editor__menu-bar"></div>
      <div ref={editorPresenceRef} className="editor__presence"></div>
      <div ref={editorContainerRef} className="editor__container">
        <div ref={editorOutlineRef} className="editor__outline"></div>
        <div ref={editorRef} className="editor">
          <CKEditor
            editor={DecoupledEditor}
            config={editorConfig}
            data={editorData}
            onChange={(event: any, editor: any) => {
              setEditorData(editor.getData());
            }}
            onReady={(editor: any) => {
              if (editorToolbarRef.current) {
                editor.ui.view.toolbar.element.appendChild(editorToolbarRef.current);
              }
            }}
          />
        </div>
        <div ref={editorRevisionHistoryRef} className="editor__revision-history">
          <div ref={editorRevisionHistorySidebarRef} className="editor__revision-history-sidebar"></div>
          <div ref={editorRevisionHistoryEditorRef} className="editor__revision-history-editor"></div>
        </div>
        <div ref={editorAnnotationsRef} className="editor__annotations"></div>
      </div>
    </div>
  );
}

export default App;
