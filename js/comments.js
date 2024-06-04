(function() {
    function onNodeMutation(nodeType, callback) {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const mutationCallback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName.toLowerCase() === nodeType.toLowerCase()) {
                            callback(node, 'added');
                        }
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeName.toLowerCase() === nodeType.toLowerCase()) {
                            callback(node, 'removed');
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetNode, config);
    }

    function onSizeChange(elem, callback) {
        const observer = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const { width, height } = entry.contentRect;
            callback({ width, height });
          });
        });
      
        observer.observe(elem);
      
        return () => {
          observer.unobserve(elem);
        };
      }

    onNodeMutation('iframe', (iframeNode, mutationType) => {
        if (mutationType === 'added') {
            iframeNode.addEventListener('load', () => {
                onSizeChange(iframeNode.contentWindow.document.body, () => {
                    iframeNode.height = iframeNode.contentWindow.document.body.scrollHeight + "px";
                });
            });
        }
    });

    const htmlToAppend = `<div id="cusdis_thread"
        data-host="https://comments.dharmil.com"
        data-app-id="dcebc543-058f-404e-aff3-16de05cc3bd9"
        data-page-id="${window.location.pathname}"
        data-page-url="${window.location.href}"
        data-page-title="${document.title}"
    ></div>
    `;

    document.body.insertAdjacentHTML('beforeend', htmlToAppend);
})();