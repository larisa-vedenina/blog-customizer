import { useState, useRef, useEffect } from 'react';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	ArticleStateType,
} from '../../constants/articleProps';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	currentSettings: ArticleStateType; // текущие настройки статьи
	onApply: (settings: ArticleStateType) => void; // коллбек при применении новых настроек
}


export const ArticleParamsForm = ({
	currentSettings,
	onApply
}: ArticleParamsFormProps) => {

	// Состояние для отслеживания видимости формы
	const [isFormOpen, setIsFormOpen] = useState(false);

	// Состояние формы для хранения изменяемых настроек
	const [formState, setFormState] = useState(currentSettings);

	// Ref для отслеживания кликов вне формы
	const formRef = useRef<HTMLDivElement>(null);

	// переключение видимости формы
	const toggleFormVisibility = () => {
		setIsFormOpen(!isFormOpen);
	};

	// обработчик изменения любого параметра
	// paramName - имя изменяемого параметра (ключ из ArticleStateType)
	// value - новое значение параметра
	const handleParamChange = (paramName: keyof ArticleStateType, value: any) => {
		setFormState({
			...formState,
			[paramName]: value,
		});
	};

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Передаем новые настройки
		onApply(formState);

		setIsFormOpen(false);
	};

	// Обработчик сброса формы к значениям по умолчанию
	const handleReset = () => {
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	// обработка кликов вне формы и нажатия Escape
	useEffect(() => {
		// Обработчик клика вне формы
		const handleClickOutside = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setIsFormOpen(false);
			}
		};

		// Обработчик нажатия Esc
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsFormOpen(false);
			}
		};

		// Добавляем обработчики только когда форма открыта
		if (isFormOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleEscapeKey);
		}

		// Удаляем обработчики при размонтировании компонента
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isFormOpen]);

	return (
		<div ref={formRef}>
			<ArrowButton isOpen={isFormOpen} onClick={toggleFormVisibility} />

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>

				{/* Форма настроек */}
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>

					{/* Заголовок формы */}
					<Text size={31} weight={800} uppercase>
						Настройки статьи
					</Text>

					{/* Выбор шрифта */}
					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						title="Тип шрифта"
						onChange={(selected) =>
							handleParamChange('fontFamilyOption', selected)
						}
					/>

					{/* Размера текста кнопки */}
					<RadioGroup
						name="fontSize"
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						title="Размер текста"
						onChange={(selected) =>
							handleParamChange('fontSizeOption', selected)
						}
					/>

					{/* цвет текста */}
					<Select
						selected={formState.fontColor}
						options={fontColors}
						title="Цвет текста"
						onChange={(selected) => handleParamChange('fontColor', selected)}
					/>

					<Separator />

					{/* Цвета фона */}
					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						title="Цвет фона"
						onChange={(selected) =>
							handleParamChange('backgroundColor', selected)
						}
					/>

					{/* Ширина контента */}
					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						title="Ширина контента"
						onChange={(selected) =>
							handleParamChange('contentWidth', selected)
						}
					/>

					{/* Кнопки формы */}
					<div className={styles.bottomContainer}>
						<Button title="Сбросить" htmlType="reset" type="clear" />
						<Button title="Применить" htmlType="submit" type="apply" />
					</div>
				</form>
			</aside>
		</div>
	);
};
