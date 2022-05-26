import {
	AnchorButton,
	CreatePage,
	DataGridPage,
	DeleteEntityButton,
	EditPage,
	EnumCell,
	GenericCell,
	HasManySelectCell,
	HasOneSelectCell,
	ImageUploadField,
	LinkButton,
	MultiSelectField,
	NumberCell,
	RichTextField,
	SelectField,
	SlugField,
	TextCell,
	TextField,
} from '@contember/admin'
import { CategoryForm } from './categories'
import { DataGridTile } from '../components/DataGridTile'


const stateOptions = {
	draft: 'Draft',
	published: 'Published',
	removed: 'Removed',
}

export const List = () => <DataGridPage
	entities="Article"
	itemsPerPage={20}
	tile={<DataGridTile
		to={`article/edit(id: $entity.id)`}
		thumbnailField="image.url"
		titleField="title"
	/>}
	tileSize={100}
	rendererProps={{
		actions: <LinkButton to="article/create">Add article</LinkButton>,
		layout: 'full-width',
		title: 'Articles',
	}}
>
	<TextCell field="title" header="Title" />
	<TextCell field="content" header="Content" />
	<HasOneSelectCell field="category" options={`Category.locales(locale.code = 'cs').name`} header="Category" />
	<HasManySelectCell field="tags" options={`Tag.locales(locale.code = 'cs').name`} header="Tags" />
	<EnumCell field={'state'} options={stateOptions} header={'State'} />
	<NumberCell field="number" header="Number" />
	<GenericCell canBeHidden={false} justification="justifyEnd">
		<LinkButton to={`article/edit(id: $entity.id)`} Component={AnchorButton}>Edit</LinkButton>
		<DeleteEntityButton title="Delete" immediatePersist={true} />
	</GenericCell>
</DataGridPage>

const articleForm = (
	<>
		<ImageUploadField
			label="Image"
			baseEntity="image"
			urlField="url"
			widthField="width"
			heightField="height"
			fileSizeField="size"
			fileTypeField="type"
		/>

		<MultiSelectField
			label={'tags'}
			field={'tags'}
			options={{
				fields: 'Tag.name',
				orderBy: 'name desc',
			}}
			createNewForm={<TextField field={'name'} label={'Name'} />}
		/>g

		<SelectField
			label={'category'}
			field={'category'}
			createNewForm={<CategoryForm />}
			options={{
				fields: 'Category.name',
				orderBy: 'name desc',
			}}
		/>

		<TextField field={'title'} label={'Title'} />
		<RichTextField field={'content'} label={'Content'} />
		<SlugField field={'slug'} label={'Slug'} derivedFrom={'title'} unpersistedHardPrefix={'http://localhost/'} persistedHardPrefix={'bar/'}
		           persistedSoftPrefix={'lorem/'} linkToExternalUrl />
		<SelectField field={'state'} label={'State'} options={Object.entries(stateOptions).map(([value, label]) => ({ value, label }))} allowNull />
	</>
)

export const create = (
	<CreatePage entity="Article" redirectOnSuccess="article/edit(id: $entity.id)">
		{articleForm}
	</CreatePage>
)

export const edit = (
	<EditPage entity="Article(id = $id)" rendererProps={{ title: 'Article' }}>
		{articleForm}
	</EditPage>
)
