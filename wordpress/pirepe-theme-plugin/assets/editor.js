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

  const { Fill: BuilderToolbarFill, Slot: BuilderToolbarSlot } = createSlotFill('PirepeBuilderToolbar');

  function buildContainerClass(settings) {
    return [
      'pirepe-container',
      settings.stackOnMobile ? 'is-stack-on-mobile' : null,
      settings.gap ? `has-gap-${settings.gap}` : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  registerBlockType('pirepe/container', {
    title: __('Pirepe Container', 'pirepe-theme'),
    description: __('A flex-based container with builder-focused controls.', 'pirepe-theme'),
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
              { title: __('Builder Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(ToggleControl, {
                label: __('Stack on mobile', 'pirepe-theme'),
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
                label: __('Gap', 'pirepe-theme'),
                value: builderSettings.gap,
                options: [
                  { label: __('None', 'pirepe-theme'), value: 'none' },
                  { label: __('Small', 'pirepe-theme'), value: 'sm' },
                  { label: __('Medium', 'pirepe-theme'), value: 'md' },
                  { label: __('Large', 'pirepe-theme'), value: 'lg' },
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

  registerBlockType('pirepe/grid', {
    title: __('Pirepe Grid', 'pirepe-theme'),
    description: __('A responsive grid container for layout sections.', 'pirepe-theme'),
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
          'pirepe-grid',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--pirepe-grid-columns': attributes.columns,
          '--pirepe-grid-min': attributes.minColumnWidth,
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
              { title: __('Grid Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(RangeControl, {
                label: __('Columns', 'pirepe-theme'),
                value: attributes.columns,
                onChange: function (value) {
                  setAttributes({ columns: value || 1 });
                },
                min: 1,
                max: 6,
              }),
              wp.element.createElement(TextControl, {
                label: __('Minimum column width', 'pirepe-theme'),
                value: attributes.minColumnWidth,
                onChange: function (value) {
                  setAttributes({ minColumnWidth: value });
                },
              }),
              wp.element.createElement(SelectControl, {
                label: __('Gap', 'pirepe-theme'),
                value: attributes.gap,
                options: [
                  { label: __('None', 'pirepe-theme'), value: 'none' },
                  { label: __('Small', 'pirepe-theme'), value: 'sm' },
                  { label: __('Medium', 'pirepe-theme'), value: 'md' },
                  { label: __('Large', 'pirepe-theme'), value: 'lg' },
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
          'pirepe-grid',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--pirepe-grid-columns': attributes.columns,
          '--pirepe-grid-min': attributes.minColumnWidth,
        },
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/columns', {
    title: __('Pirepe Columns', 'pirepe-theme'),
    description: __('A column set with responsive stacking.', 'pirepe-theme'),
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
          'pirepe-columns',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
          attributes.stackOnMobile ? 'is-stack-on-mobile' : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--pirepe-columns-count': attributes.columns,
        },
      });

      const template = Array.from({ length: attributes.columns }).map(function () {
        return ['pirepe/column'];
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
              { title: __('Column Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(RangeControl, {
                label: __('Columns', 'pirepe-theme'),
                value: attributes.columns,
                onChange: function (value) {
                  setAttributes({ columns: value || 1 });
                },
                min: 1,
                max: 4,
              }),
              wp.element.createElement(SelectControl, {
                label: __('Gap', 'pirepe-theme'),
                value: attributes.gap,
                options: [
                  { label: __('None', 'pirepe-theme'), value: 'none' },
                  { label: __('Small', 'pirepe-theme'), value: 'sm' },
                  { label: __('Medium', 'pirepe-theme'), value: 'md' },
                  { label: __('Large', 'pirepe-theme'), value: 'lg' },
                ],
                onChange: function (value) {
                  setAttributes({ gap: value });
                },
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Stack on mobile', 'pirepe-theme'),
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
              allowedBlocks: ['pirepe/column'],
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
          'pirepe-columns',
          attributes.gap ? `has-gap-${attributes.gap}` : null,
          attributes.stackOnMobile ? 'is-stack-on-mobile' : null,
        ]
          .filter(Boolean)
          .join(' '),
        style: {
          '--pirepe-columns-count': attributes.columns,
        },
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/column', {
    title: __('Pirepe Column', 'pirepe-theme'),
    parent: ['pirepe/columns'],
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
      const blockProps = useBlockProps({ className: 'pirepe-column' });
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
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'pirepe-column' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/spacer', {
    title: __('Pirepe Spacer', 'pirepe-theme'),
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
        className: 'pirepe-spacer',
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
              { title: __('Spacer Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(TextControl, {
                label: __('Height', 'pirepe-theme'),
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
        className: 'pirepe-spacer',
        style: { height: attributes.height },
      });
      return wp.element.createElement('div', blockProps);
    },
  });

  registerBlockType('pirepe/divider', {
    title: __('Pirepe Divider', 'pirepe-theme'),
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
      const blockProps = useBlockProps({ className: 'pirepe-divider' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Divider Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(RangeControl, {
                label: __('Thickness', 'pirepe-theme'),
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
        className: 'pirepe-divider',
        style: { borderTopWidth: `${attributes.thickness}px` },
      });
      return wp.element.createElement('hr', blockProps);
    },
  });

  registerBlockType('pirepe/tabs', {
    title: __('Pirepe Tabs', 'pirepe-theme'),
    icon: 'index-card',
    category: 'widgets',
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'pirepe-tabs' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks, {
          allowedBlocks: ['pirepe/tab'],
          template: [['pirepe/tab'], ['pirepe/tab']],
          templateLock: false,
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },
    save: function Save() {
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'pirepe-tabs' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/tab', {
    title: __('Tab', 'pirepe-theme'),
    parent: ['pirepe/tabs'],
    icon: 'index-card',
    category: 'widgets',
    attributes: {
      title: {
        type: 'string',
        default: __('Tab title', 'pirepe-theme'),
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({ className: 'pirepe-tab' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Tab Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(TextControl, {
                label: __('Title', 'pirepe-theme'),
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
            wp.element.createElement('div', { className: 'pirepe-tab__label' }, attributes.title),
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
        className: 'pirepe-tab',
        'data-title': attributes.title,
      });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/accordion', {
    title: __('Pirepe Accordion', 'pirepe-theme'),
    icon: 'list-view',
    category: 'widgets',
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'pirepe-accordion' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks, {
          allowedBlocks: ['pirepe/accordion-item'],
          template: [['pirepe/accordion-item'], ['pirepe/accordion-item']],
          templateLock: false,
          renderAppender: InnerBlocks.ButtonBlockAppender,
        })
      );
    },
    save: function Save() {
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'pirepe-accordion' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/accordion-item', {
    title: __('Accordion Item', 'pirepe-theme'),
    parent: ['pirepe/accordion'],
    icon: 'list-view',
    category: 'widgets',
    attributes: {
      title: {
        type: 'string',
        default: __('Accordion title', 'pirepe-theme'),
      },
      isOpen: {
        type: 'boolean',
        default: false,
      },
    },
    edit: function Edit(props) {
      const { attributes, setAttributes } = props;
      const blockProps = useBlockProps({ className: 'pirepe-accordion-item' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Accordion Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(TextControl, {
                label: __('Title', 'pirepe-theme'),
                value: attributes.title,
                onChange: function (value) {
                  setAttributes({ title: value });
                },
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Open by default', 'pirepe-theme'),
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
            wp.element.createElement('div', { className: 'pirepe-accordion-item__label' }, attributes.title),
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
        className: 'pirepe-accordion-item',
      });
      return wp.element.createElement(
        'details',
        Object.assign({}, blockProps, { open: attributes.isOpen || undefined }),
        wp.element.createElement('summary', null, attributes.title),
        wp.element.createElement('div', { className: 'pirepe-accordion-item__content' }, wp.element.createElement(InnerBlocks.Content, null))
      );
    },
  });

  registerBlockType('pirepe/carousel', {
    title: __('Pirepe Carousel', 'pirepe-theme'),
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
      const blockProps = useBlockProps({ className: 'pirepe-carousel' });
      return (
        wp.element.createElement(
          Fragment,
          null,
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              PanelBody,
              { title: __('Carousel Settings', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(ToggleControl, {
                label: __('Autoplay', 'pirepe-theme'),
                checked: attributes.autoplay,
                onChange: function (value) {
                  setAttributes({ autoplay: value });
                },
              }),
              wp.element.createElement(RangeControl, {
                label: __('Interval (ms)', 'pirepe-theme'),
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
              allowedBlocks: ['pirepe/slide'],
              template: [['pirepe/slide'], ['pirepe/slide']],
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
        className: 'pirepe-carousel',
        'data-autoplay': attributes.autoplay ? 'true' : 'false',
        'data-interval': attributes.interval,
      });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement('div', { className: 'pirepe-carousel__track' }, wp.element.createElement(InnerBlocks.Content, null))
      );
    },
  });

  registerBlockType('pirepe/slide', {
    title: __('Carousel Slide', 'pirepe-theme'),
    parent: ['pirepe/carousel'],
    icon: 'format-image',
    category: 'widgets',
    edit: function Edit() {
      const blockProps = useBlockProps({ className: 'pirepe-slide' });
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
      const blockProps = wp.blockEditor.useBlockProps.save({ className: 'pirepe-slide' });
      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });

  registerBlockType('pirepe/dynamic-text', {
    title: __('Dynamic Text', 'pirepe-theme'),
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
      const blockProps = useBlockProps({ className: 'pirepe-dynamic-text' });
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
            setPreview(__('Select a post to preview.', 'pirepe-theme'));
            return;
          }
          if (attributes.source === 'post_title' && record) {
            setPreview(record.title?.rendered || __('(No title)', 'pirepe-theme'));
            return;
          }
          if (attributes.source === 'post_meta' && attributes.metaKey) {
            apiFetch({ path: `/wp/v2/${postType}/${postId}?context=edit` })
              .then(function (response) {
                const value = response?.meta?.[attributes.metaKey];
                setPreview(value ? String(value) : __('(No meta value)', 'pirepe-theme'));
              })
              .catch(function () {
                setPreview(__('(Meta unavailable)', 'pirepe-theme'));
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
              { title: __('Dynamic Source', 'pirepe-theme'), initialOpen: true },
              wp.element.createElement(SelectControl, {
                label: __('Source', 'pirepe-theme'),
                value: attributes.source,
                options: [
                  { label: __('Post title', 'pirepe-theme'), value: 'post_title' },
                  { label: __('Post meta', 'pirepe-theme'), value: 'post_meta' },
                ],
                onChange: function (value) {
                  setAttributes({ source: value });
                },
              }),
              attributes.source === 'post_meta'
                ? wp.element.createElement(TextControl, {
                    label: __('Meta key', 'pirepe-theme'),
                    value: attributes.metaKey,
                    onChange: function (value) {
                      setAttributes({ metaKey: value });
                    },
                  })
                : null
            )
          ),
          wp.element.createElement('div', blockProps, preview || __('(Select a source)', 'pirepe-theme'))
        )
      );
    },
    save: function Save() {
      return null;
    },
  });

  wp.hooks.addFilter('editor.BlockEdit', 'pirepe/builder-toolbar-slot', function (BlockEdit) {
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

  registerPlugin('pirepe-theme-toolbar', {
    render: function () {
      return wp.element.createElement(
        BuilderToolbarFill,
        null,
        wp.element.createElement(
          ToolbarGroup,
          null,
          wp.element.createElement(ToolbarButton, {
            icon: 'move',
            label: __('Drag handle', 'pirepe-theme'),
            onClick: function () {},
          }),
          wp.element.createElement(ToolbarButton, {
            icon: 'align-wide',
            label: __('Toggle width', 'pirepe-theme'),
            onClick: function () {},
          }),
          wp.element.createElement(ToolbarButton, {
            icon: 'smartphone',
            label: __('Responsive toggle', 'pirepe-theme'),
            onClick: function () {},
          })
        )
      );
    },
  });
})(window.wp);
