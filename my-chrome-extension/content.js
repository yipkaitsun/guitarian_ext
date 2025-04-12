chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "runFunction") {
        const chordListWrapper = document.querySelector('.chord-list-wrapper');

        const domMap = new Map();

        if (chordListWrapper) {
            const chordDiagrams = chordListWrapper.querySelectorAll('.chord-diagram-wrapper');
            chordDiagrams.forEach((diagram) => {
                const chordNameElement = diagram.querySelector('.chord-name');
                if (chordNameElement) {
                    const chordKey = chordNameElement.textContent.trim();
                    domMap.set(chordKey, diagram);
                }
            });

        } else {
            console.log('No chord-list-wrapper element found');
        }
        const keys = Array.from(domMap.keys()).sort((a, b) => b.length - a.length).join('|');
        const regex = new RegExp(`(${keys}(?:\\/\\w+)?|\\s+)`, 'g');
        const sectionsWrapper = document.querySelector('.sections-wrapper');

        if (sectionsWrapper) {
            const spans = sectionsWrapper.querySelectorAll('span');

            const popup = document.createElement('div');
            popup.style.position = 'absolute';
            popup.style.backgroundColor = '#fff';
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '5px';
            popup.style.borderRadius = '5px';
            popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
            popup.style.display = 'none';
            popup.style.zIndex = '1000';
            document.body.appendChild(popup);

            spans.forEach((span) => {
                const scoreSection = span.querySelector('.score-section');
                if (scoreSection) {
                    const innerDiv = scoreSection.querySelector('div');
                    if (innerDiv) {
                        const pre = innerDiv.querySelector('pre');
                        if (pre) {
                            const updatedText = pre.textContent.replace(/[\|丨]/g, '  ');
                            const chords = updatedText.match(regex);
                            pre.innerHTML = '';
                            chords.forEach((chord) => {
                                const chordSpan = document.createElement('span');
                                chordSpan.textContent = chord;

                                chordSpan.addEventListener('mouseenter', (event) => {
                                    const domValue = domMap.get(chord.trim());
                                    if (domValue) {
                                        popup.innerHTML = '';
                                        const clonedDom = domValue.cloneNode(true);
                                        popup.appendChild(clonedDom);
                                        popup.style.left = `${event.pageX + 10}px`;
                                        popup.style.top = `${event.pageY + 10}px`;
                                        popup.style.display = 'block';
                                    }
                                });

                                chordSpan.addEventListener('mouseleave', () => {
                                    popup.style.display = 'none';
                                });

                                pre.appendChild(chordSpan);
                            });
                        } else {
                            console.log('No <pre> element found in the container');
                        }
                    } else {
                        console.log('No inner div found in score-section');
                    }
                } else {
                    console.log('No score-section found in this span');
                }
            });
        } else {
            console.log('sections-wrapper not found');
        }
    }
});