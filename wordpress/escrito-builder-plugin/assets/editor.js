(function (wp) {
  const { __ } = wp.i18n;
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, InnerBlocks, useBlockProps, BlockControls } = wp.blockEditor;
  const { PanelBody, ToggleControl, SelectControl, RangeControl, TextControl, ToolbarButton, ToolbarGroup } = wp.components;
  const { createSlotFill } = wp.components;
  const { registerPlugin } = wp.plugins;
  const { Fragment, useEffect, useState } = wp.element;
  const { useSelect } = wp.data;
  const apiFetch = wp.apiFetch;

  const { Fill: BuilderToolbarFill, Slot: BuilderToolbarSlot } = createSlotFill('EscritoBuilderToolbar');

  function buildContainerClass(settings) {
    return [
      'escrito-container',
      settings.stackOnMobile ? 'is-stack-on-mobile' : null,
      settings.gap ? `has-gap-${settings.gap}` : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  registerBlockType('escrito/container', {
    title: __('Escrito Container', 'escrito-builder'),
    description: __('A flex-based container with builder-focused controls.', 'escrito-builder'),
    icon: 'screenoptions',
    category: 'layout',
    attributes: {
      layout: {
        type: 'object',
        default: {
          type: 'flex',
          allowSizingOnChildren: true,
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
        },
      },
      builderSettings: {
        type: 'object',
        default: {
          stackOnMobile: true,
          gap: 'md',
        },
      },
    },
    supports: {
      align: ['wide', 'full'],
      anchor: true,
      spacing: {
        margin: true,
        padding: true,
      },
      color: {
        background: true,
        text: true,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const { builderSettings } = attributes;
      const blockProps = useBlockProps({
        className: buildContainerClass(builderSettings),
      });

      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Builder Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(ToggleControl, {
                label: __('Stack on mobile', 'escrito-builder'),
                checked: builderSettings.stackOnMobile,
                onChange: function (value) {
                  setAttributes({
                    builderSettings: Object.assign({}, builderSettings, {
                      stackOnMobile: value,
                    }),
                  });
                },
              }),
              wp.element.createElement(SelectControl, {
                label: __('Gap', 'escrito-builder'),
                value: builderSettings.gap,
                options: [
                  { label: __('None', 'escrito-builder'), value: 'none' },
                  { label: __('Small', 'escrito-builder'), value: 'sm' },
                  { label: __('Medium', 'escrito-builder'), value: 'md' },
                  { label: __('Large', 'escrito-builder'), value: 'lg' },
                ],
                onChange: function (value) {
                  setAttributes({
                    builderSettings: Object.assign({}, builderSettings, {
                      gap: value,
                    }),
                  });
                },
              })
            )
          ),
          wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement(InnerBlocks, {
              orientation: 'horizontal',
              templateLock: false,
              renderAppender: InnerBlocks.ButtonBlockAppender,
            })
          )
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const { builderSettings } = attributes;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: buildContainerClass(builderSettings),
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/grid', {
    title: __('Escrito Grid', 'escrito-builder'),
    description: __('A responsive grid container for layout sections.', 'escrito-builder'),
    icon: 'grid-view',
    category: 'layout',
    attributes: {
      columns: {
        type: 'number',
        default: 3,
      },
      minColumnWidth: {
        type: 'string',
        default: '220px',
      },
      gap: {
        type: 'string',
        default: 'md',
      },
    },
    supports: {
      align: ['wide', 'full'],
      anchor: true,
      spacing: {
        margin: true,
        padding: true,
      },
      color: {
        background: true,
        text: true,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({
        className: [
          'escrito-grid',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--escrito-grid-columns': attributes.columns,
          '--escrito-grid-min': attributes.minColumnWidth,
        },
      });

      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Grid Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(RangeControl, {
                label: __('Columns', 'escrito-builder'),
                value: attributes.columns,
                onChange: function (value) {
                  setAttributes({ columns: value || 1 });
                },
                min: 1,
                max: 6,
              }),
              wp.element.createElement(TextControl, {
                label: __('Minimum column width', 'escrito-builder'),
                value: attributes.minColumnWidth,
                onChange: function (value) {
                  setAttributes({ minColumnWidth: value });
                },
              }),
              wp.element.createElement(SelectControl, {
                label: __('Gap', 'escrito-builder'),
                value: attributes.gap,
                options: [
                  { label: __('None', 'escrito-builder'), value: 'none' },
                  { label: __('Small', 'escrito-builder'), value: 'sm' },
                  { label: __('Medium', 'escrito-builder'), value: 'md' },
                  { label: __('Large', 'escrito-builder'), value: 'lg' },
                ],
                onChange: function (value) {
                  setAttributes({ gap: value });
                },
              })
            )
          ),
          wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement(InnerBlocks, {
              templateLock: false,
              renderAppender: InnerBlocks.ButtonBlockAppender,
            })
          )
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: [
          'escrito-grid',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--escrito-grid-columns': attributes.columns,
          '--escrito-grid-min': attributes.minColumnWidth,
        },
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/columns', {
    title: __('Escrito Columns', 'escrito-builder'),
    description: __('A column set with responsive stacking.', 'escrito-builder'),
    icon: 'columns',
    category: 'layout',
    attributes: {
      columns: {
        type: 'number',
        default: 2,
      },
      gap: {
        type: 'string',
        default: 'md',
      },
      stackOnMobile: {
        type: 'boolean',
        default: true,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({
        className: [
          'escrito-columns',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
          attributes.stackOnMobile ? 'is-stack-on-mobile' : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--escrito-columns-count': attributes.columns,
        },
      });

      const template = Array.from({ length: attributes.columns }).map(function () {
        return ['escrito/column'];
      });

      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Column Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(RangeControl, {
                label: __('Columns', 'escrito-builder'),
                value: attributes.columns,
                onChange: function (value) {
                  setAttributes({ columns: value || 1 });
                },
                min: 1,
                max: 4,
              }),
              wp.element.createElement(SelectControl, {
                label: __('Gap', 'escrito-builder'),
                value: attributes.gap,
                options: [
                  { label: __('None', 'escrito-builder'), value: 'none' },
                  { label: __('Small', 'escrito-builder'), value: 'sm' },
                  { label: __('Medium', 'escrito-builder'), value: 'md' },
                  { label: __('Large', 'escrito-builder'), value: 'lg' },
                ],
                onChange: function (value) {
                  setAttributes({ gap: value });
                },
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Stack on mobile', 'escrito-builder'),
                checked: attributes.stackOnMobile,
                onChange: function (value) {
                  setAttributes({ stackOnMobile: value });
                },
              })
            )
          ),
          wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement(InnerBlocks, {
              allowedBlocks: ['escrito/column'],
              template: template,
              templateLock: false,
              renderAppender: InnerBlocks.ButtonBlockAppender,
            })
          )
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: [
          'escrito-columns',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
          attributes.stackOnMobile ? 'is-stack-on-mobile' : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--escrito-columns-count': attributes.columns,
        },
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/column', {
    title: __('Escrito Column', 'escrito-builder'),
    parent: ['escrito/columns'],
    icon: 'editor-table',
    category: 'layout',
    supports: {
      anchor: true,
      spacing: {
        margin: true,
        padding: true,
      },
      color: {
        background: true,
        text: true,
      },
    },
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'escrito-column' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks, {
          templateLock: false,
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },
    save: function Save() {
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'escrito-column' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/spacer', {
    title: __('Escrito Spacer', 'escrito-builder'),
    icon: 'arrow-down-alt2',
    category: 'layout',
    attributes: {
      height: {
        type: 'string',
        default: '48px',
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({
        className: 'escrito-spacer',
        style: { height: attributes.height },
      });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Spacer Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(TextControl, {
                label: __('Height', 'escrito-builder'),
                value: attributes.height,
                onChange: function (value) {
                  setAttributes({ height: value });
                },
              })
            )
          ),
          wp.element.createElement('div', blockProps)
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: 'escrito-spacer',
        style: { height: attributes.height },
      });
      return wp.element.createElement('div', blockProps);
    },
  });

  registerBlockType('escrito/divider', {
    title: __('Escrito Divider', 'escrito-builder'),
    icon: 'minus',
    category: 'layout',
    attributes: {
      thickness: {
        type: 'number',
        default: 1,
      },
    },
    supports: {
      color: {
        background: true,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({ className: 'escrito-divider' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Divider Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(RangeControl, {
                label: __('Thickness', 'escrito-builder'),
                value: attributes.thickness,
                min: 1,
                max: 8,
                onChange: function (value) {
                  setAttributes({ thickness: value || 1 });
                },
              })
            )
          ),
          wp.element.createElement('hr', Object.assign({}, blockProps, {
            style: { borderTopWidth: `${attributes.thickness}px` },
          }))
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: 'escrito-divider',
        style: { borderTopWidth: `${attributes.thickness}px` },
      });
      return wp.element.createElement('hr', blockProps);
    },
  });

  registerBlockType('escrito/tabs', {
    title: __('Escrito Tabs', 'escrito-builder'),
    icon: 'index-card',
    category: 'widgets',
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'escrito-tabs' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks, {
          allowedBlocks: ['escrito/tab'],
          template: [['escrito/tab'], ['escrito/tab']],
          templateLock: false,
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },
    save: function Save() {
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'escrito-tabs' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/tab', {
    title: __('Tab', 'escrito-builder'),
    parent: ['escrito/tabs'],
    icon: 'index-card',
    category: 'widgets',
    attributes: {
      title: {
        type: 'string',
        default: __('Tab title', 'escrito-builder'),
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({ className: 'escrito-tab' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Tab Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(TextControl, {
                label: __('Title', 'escrito-builder'),
                value: attributes.title,
                onChange: function (value) {
                  setAttributes({ title: value });
                },
              })
            )
          ),
          wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement('div', { className: 'escrito-tab__label' }, attributes.title),
            wp.element.createElement(InnerBlocks, {
              templateLock: false,
              renderAppender: InnerBlocks.ButtonBlockAppender,
            })
          )
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: 'escrito-tab',
        'data-title': attributes.title,
      });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/accordion', {
    title: __('Escrito Accordion', 'escrito-builder'),
    icon: 'list-view',
    category: 'widgets',
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'escrito-accordion' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks, {
          allowedBlocks: ['escrito/accordion-item'],
          template: [['escrito/accordion-item'], ['escrito/accordion-item']],
          templateLock: false,
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },
    save: function Save() {
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'escrito-accordion' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/accordion-item', {
    title: __('Accordion Item', 'escrito-builder'),
    parent: ['escrito/accordion'],
    icon: 'list-view',
    category: 'widgets',
    attributes: {
      title: {
        type: 'string',
        default: __('Accordion title', 'escrito-builder'),
      },
      isOpen: {
        type: 'boolean',
        default: false,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({ className: 'escrito-accordion-item' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Accordion Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(TextControl, {
                label: __('Title', 'escrito-builder'),
                value: attributes.title,
                onChange: function (value) {
                  setAttributes({ title: value });
                },
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Open by default', 'escrito-builder'),
                checked: attributes.isOpen,
                onChange: function (value) {
                  setAttributes({ isOpen: value });
                },
              })
            )
          ),
          wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement('div', { className: 'escrito-accordion-item__label' }, attributes.title),
            wp.element.createElement(InnerBlocks, {
              templateLock: false,
              renderAppender: InnerBlocks.ButtonBlockAppender,
            })
          )
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: 'escrito-accordion-item',
      });
      return wp.element.createElement(
        'details',
        Object.assign({}, blockProps, { open: attributes.isOpen || undefined }),
        wp.element.createElement('summary', null, attributes.title),
        wp.element.createElement('div', { className: 'escrito-accordion-item__content' }, wp.element.createElement(InnerBlocks.Content, null))
      );
    },
  });

  registerBlockType('escrito/carousel', {
    title: __('Escrito Carousel', 'escrito-builder'),
    icon: 'images-alt2',
    category: 'widgets',
    attributes: {
      autoplay: {
        type: 'boolean',
        default: false,
      },
      interval: {
        type: 'number',
        default: 5000,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({ className: 'escrito-carousel' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Carousel Settings', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(ToggleControl, {
                label: __('Autoplay', 'escrito-builder'),
                checked: attributes.autoplay,
                onChange: function (value) {
                  setAttributes({ autoplay: value });
                },
              }),
              wp.element.createElement(RangeControl, {
                label: __('Interval (ms)', 'escrito-builder'),
                value: attributes.interval,
                min: 2000,
                max: 10000,
                step: 500,
                onChange: function (value) {
                  setAttributes({ interval: value || 5000 });
                },
              })
            )
          ),
          wp.element.createElement(
            'div',
            blockProps,
            wp.element.createElement(InnerBlocks, {
              allowedBlocks: ['escrito/slide'],
              template: [['escrito/slide'], ['escrito/slide']],
              templateLock: false,
              renderAppender: InnerBlocks.ButtonBlockAppender,
            })
          )
        )
      );
    },
    save: function Save(props) {
      const { attributes } = props;
      const blockProps = wp.blockEditor.useBlockProps.save({
        className: 'escrito-carousel',
        'data-autoplay': attributes.autoplay ? 'true' : 'false',
        'data-interval': attributes.interval,
      });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement('div', { className: 'escrito-carousel__track' }, wp.element.createElement(InnerBlocks.Content, null))
      );
    },
  });

  registerBlockType('escrito/slide', {
    title: __('Carousel Slide', 'escrito-builder'),
    parent: ['escrito/carousel'],
    icon: 'format-image',
    category: 'widgets',
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'escrito-slide' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks, {
          templateLock: false,
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },
    save: function Save() {
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'escrito-slide' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('escrito/dynamic-text', {
    title: __('Dynamic Text', 'escrito-builder'),
    icon: 'editor-code',
    category: 'widgets',
    attributes: {
      source: {
        type: 'string',
        default: 'post_title',
      },
      metaKey: {
        type: 'string',
        default: '',
      },
    },
    usesContext: ['postId', 'postType'],
    edit: function Edit(props) {
      const { attributes, setAttributes, context } = props;
      const blockProps = useBlockProps({ className: 'escrito-dynamic-text' });
      const [preview, setPreview] = useState('');
      const postId = context.postId;
      const postType = context.postType || 'post';
      const record = useSelect(
        function (select) {
          if (!postId) {
            return null;
          }
          return select('core').getEntityRecord('postType', postType, postId);
        },
        [postId, postType]
      );

      useEffect(
        function () {
          if (!postId) {
            setPreview(__('Select a post to preview.', 'escrito-builder'));
            return;
          }
          if (attributes.source === 'post_title' && record) {
            setPreview(record.title?.rendered || __('(No title)', 'escrito-builder'));
            return;
          }
          if (attributes.source === 'post_meta' && attributes.metaKey) {
            apiFetch({ path: `/wp/v2/${postType}/${postId}?context=edit` })
              .then(function (response) {
                const value = response?.meta?.[attributes.metaKey];
                setPreview(value ? String(value) : __('(No meta value)', 'escrito-builder'));
              })
              .catch(function () {
                setPreview(__('(Meta unavailable)', 'escrito-builder'));
              });
          }
        },
        [postId, postType, record, attributes.source, attributes.metaKey]
      );

      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Dynamic Source', 'escrito-builder'), initialOpen: true },
              wp.element.createElement(SelectControl, {
                label: __('Source', 'escrito-builder'),
                value: attributes.source,
                options: [
                  { label: __('Post title', 'escrito-builder'), value: 'post_title' },
                  { label: __('Post meta', 'escrito-builder'), value: 'post_meta' },
                ],
                onChange: function (value) {
                  setAttributes({ source: value });
                },
              }),
              attributes.source === 'post_meta'
                ? wp.element.createElement(TextControl, {
                    label: __('Meta key', 'escrito-builder'),
                    value: attributes.metaKey,
                    onChange: function (value) {
                      setAttributes({ metaKey: value });
                    },
                  })
                : null
            )
          ),
          wp.element.createElement('div', blockProps, preview || __('(Select a source)', 'escrito-builder'))
        )
      );
    },
    save: function Save() {
      return null;
    },
  });

  wp.hooks.addFilter('editor.BlockEdit', 'escrito/builder-toolbar-slot', function (BlockEdit) {
    return function (props) {
      const isSelected = props.isSelected;
      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(BlockEdit, props),
        isSelected
          ? wp.element.createElement(
              BlockControls,
              { group: 'block' },
              wp.element.createElement(BuilderToolbarSlot, null)
            )
          : null
      );
    };
  });

  registerPlugin('escrito-builder-toolbar', {
    render: function () {
      return wp.element.createElement(
        BuilderToolbarFill,
        null,
        wp.element.createElement(
          ToolbarGroup,
          null,
          wp.element.createElement(ToolbarButton, {
            icon: 'move',
            label: __('Drag handle', 'escrito-builder'),
            onClick: function () {},
          }),
          wp.element.createElement(ToolbarButton, {
            icon: 'align-wide',
            label: __('Toggle width', 'escrito-builder'),
            onClick: function () {},
          }),
          wp.element.createElement(ToolbarButton, {
            icon: 'smartphone',
            label: __('Responsive toggle', 'escrito-builder'),
            onClick: function () {},
          })
        )
      );
    },
  });
})(window.wp);
