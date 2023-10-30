import { css } from '@rocket.chat/css-in-js';
import { Box, IconButton, Throbber } from '@rocket.chat/fuselage';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Keyboard, Navigation, Zoom, A11y } from 'swiper';
import type { SwiperRef } from 'swiper/react';
import { type SwiperClass, Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.css';
import 'swiper/modules/navigation/navigation.min.css';
import 'swiper/modules/keyboard/keyboard.min.css';
import 'swiper/modules/zoom/zoom.min.css';

import ImageGalleryLoader from './ImageGalleryLoader';

const swiperStyle = css`
	.swiper {
		width: 100%;
		height: 100%;
	}
	.swiper-container {
		position: absolute;
		z-index: 99;
		top: 0;

		overflow: hidden;

		width: 100%;
		height: 100%;

		background-color: var(--rcx-color-surface-overlay, rgba(0, 0, 0, 0.6));
	}

	.rcx-swiper-close-button,
	.rcx-swiper-prev-button,
	.rcx-swiper-next-button {
		color: var(--rcx-color-font-pure-white, #ffffff) !important;
	}

	.rcx-swiper-close-button {
		position: absolute;
		z-index: 10;
		top: 10px;
		right: 10px;
	}

	.rcx-swiper-prev-button,
	.rcx-swiper-next-button {
		position: absolute;
		z-index: 10;
		top: 50%;

		cursor: pointer;
	}

	.rcx-swiper-prev-button.swiper-button-disabled,
	.rcx-swiper-next-button.swiper-button-disabled {
		cursor: auto;
		pointer-events: none;

		opacity: 0.35;
	}

	.rcx-swiper-prev-button.swiper-button-hidden,
	.rcx-swiper-next-button.swiper-button-hidden {
		cursor: auto;
		pointer-events: none;

		opacity: 0;
	}

	.rcx-swiper-prev-button,
	.swiper-rtl .rcx-swiper-next-button {
		right: auto;
		left: 10px;
	}

	.rcx-swiper-next-button,
	.swiper-rtl .rcx-swiper-prev-button {
		right: 10px;
		left: auto;
	}
`;

type ImageGalleryProps = {
	images: string[];
	isLoading: boolean;
	loadMore: () => void;
	currentSlide: number | undefined;
	onClose: () => void;
};
const ImageGallery = ({ images, isLoading, loadMore, currentSlide, onClose }: ImageGalleryProps) => {
	const swiperRef = useRef<SwiperRef>(null);
	const [, setSwiperInst] = useState<SwiperClass>();

	if (isLoading) {
		return <ImageGalleryLoader />;
	}

	return createPortal(
		<Box className={swiperStyle}>
			<div className='swiper-container'>
				<IconButton icon='cross' aria-label='Close gallery' className='rcx-swiper-close-button' onClick={onClose} />
				<IconButton icon='chevron-right' className='rcx-swiper-prev-button' onClick={() => swiperRef?.current?.swiper.slidePrev()} />
				<IconButton icon='chevron-left' className='rcx-swiper-next-button' onClick={() => swiperRef?.current?.swiper.slideNext()} />
				<Swiper
					ref={swiperRef}
					navigation={{
						nextEl: '.rcx-swiper-next-button',
						prevEl: '.rcx-swiper-prev-button',
					}}
					keyboard
					zoom
					lazyPreloaderClass='rcx-lazy-preloader'
					runCallbacksOnInit
					initialSlide={currentSlide}
					onKeyPress={(_, keyCode) => String(keyCode) === '27' && onClose()}
					modules={[Navigation, Zoom, Keyboard, A11y]}
					onInit={(swiper) => setSwiperInst(swiper)}
					onReachEnd={loadMore}
				>
					{images?.map((image, index) => (
						<SwiperSlide key={`${image}-${index}`}>
							<div className='swiper-zoom-container'>
								<img src={image} loading='lazy' />
								<div className='rcx-lazy-preloader'>
									<Throbber />
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</Box>,
		document.body,
	);
};

export default ImageGallery;
