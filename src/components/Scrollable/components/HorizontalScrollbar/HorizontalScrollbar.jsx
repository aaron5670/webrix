/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useContext, useRef} from 'react';
import {oneOfType, node, func, shape, instanceOf} from 'prop-types';
import {Element} from 'utility/mocks';
import {noop} from 'utility/memory';
import Movable from 'components/Movable';
import Context from '../../Scrollable.context';
import './HorizontalScrollbar.scss';

const HorizontalScrollbar = () => {
    const track = useRef();
    const thumb = useRef();
    const initialScroll = useRef();
    const {container} = useContext(Context);

    const handleOnBeginMove = e => {
        e.stopPropagation();
        e.preventDefault();
        initialScroll.current = container.current.scrollLeft;
    };

    const handleOnMove = ({dx}) => {
        const {clientWidth, scrollWidth} = container.current;
        const handleWidth = thumb.current.clientWidth;
        const trackWidth = track.current.clientWidth;
        container.current.scrollLeft = initialScroll.current + dx * (scrollWidth - clientWidth) / (trackWidth - handleWidth);
    };

    const handleOnClick = e => {
        // Ignore clicks on the thumb itself
        if (!thumb.current.contains(e.target)) {
            const {left, width} = track.current.getBoundingClientRect();
            const {scrollWidth} = container.current;
            const ratio = (e.clientX - left) / width;
            container.current.style.scrollBehavior = 'smooth';
            container.current.scrollLeft = ratio * scrollWidth;
            container.current.style.scrollBehavior = ''; // Remove smooth scrolling as it breaks the thumb dragging
        }
    };

    return (
        <div className='scrollbar-track horizontal-scrollbar-track' ref={track} onClick={handleOnClick}>
            <Movable className='scrollbar-thumb' ref={thumb} onBeginMove={handleOnBeginMove} onMove={handleOnMove}>
                <div className='scrollbar-thumb-inner'/>
            </Movable>
        </div>
    );
};

export default HorizontalScrollbar;