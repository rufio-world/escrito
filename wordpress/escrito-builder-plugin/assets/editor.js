(function (wp) {
  const { __ } = wp.i18n;
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
  const { PanelBody, ToggleControl, SelectControl } = wp.components;

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
        className: [
          'escrito-container',
          builderSettings.stackOnMobile ? 'is-stack-on-mobile' : null,
          builderSettings.gap ? `has-gap-${builderSettings.gap}` : null,
        ]
          .filter(Boolean)
          .join(' '),
      });

      return (
        wp.element.createElement(
          wp.element.Fragment,
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
        className: [
          'escrito-container',
          builderSettings.stackOnMobile ? 'is-stack-on-mobile' : null,
          builderSettings.gap ? `has-gap-${builderSettings.gap}` : null,
        ]
          .filter(Boolean)
          .join(' '),
      });

      return wp.element.createElement(
        'div',
        blockProps,
        wp.element.createElement(InnerBlocks.Content, null)
      );
    },
  });
})(window.wp);
