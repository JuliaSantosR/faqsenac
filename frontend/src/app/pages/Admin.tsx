import {
  AlertCircle,
  Edit,
  HelpCircle,
  Image,
  LayoutPanelTop,
  LogOut,
  Megaphone,
  Save,
  Trash2,
  Video,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { ANNOUNCEMENT_PRIORITY_LABELS, formatDateFull } from '../utils/contentHelpers';
import { getSafeVideoUrl, isValidImageUrl, normalizeVideoUrl } from '../utils/faqMediaHelpers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export function Admin() {
  const { user, logout } = useAuth();
  const {
    content: { announcements, faqCategories, home },
    createAnnouncement,
    createFAQEntry,
    deleteAnnouncement,
    deleteFAQEntry,
    updateAnnouncement,
    updateFAQCategory,
    updateFAQEntry,
    updateHomeContent,
  } = useContent();

  const [homeForm, setHomeForm] = useState(home);
  const [selectedCategoryId, setSelectedCategoryId] = useState(faqCategories[0]?.id ?? '');
  const [categoryForm, setCategoryForm] = useState({ label: '', description: '' });
  const [faqEntryForm, setFaqEntryForm] = useState({
    id: '',
    question: '',
    answer: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [announcementForm, setAnnouncementForm] = useState({
    id: '',
    date: '',
    category: '',
    priority: 'medium',
    title: '',
    description: '',
    details: '',
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [faqEntryFeedback, setFaqEntryFeedback] = useState<string | null>(null);
  const [isHomeDirty, setIsHomeDirty] = useState(false);
  const previousCategoryIdRef = useRef<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm?: () => void | Promise<void>;
  }>({
    open: false,
    title: '',
    description: '',
  });

  const selectedCategory = useMemo(
    () => faqCategories.find((category) => category.id === selectedCategoryId) ?? faqCategories[0],
    [faqCategories, selectedCategoryId],
  );

  const totalFAQEntries = faqCategories.reduce((total, category) => total + category.items.length, 0);
  const sortedAnnouncements = [...announcements].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  useEffect(() => {
    if (!isHomeDirty) {
      setHomeForm(home);
    }
  }, [home, isHomeDirty]);

  useEffect(() => {
    if (!faqCategories.find((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId(faqCategories[0]?.id ?? '');
    }
  }, [faqCategories, selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }

    setCategoryForm({
      label: selectedCategory.label,
      description: selectedCategory.description,
    });

    if (previousCategoryIdRef.current !== selectedCategory.id) {
      resetFAQEntryForm();
      previousCategoryIdRef.current = selectedCategory.id;
    }
  }, [selectedCategory]);

  const MIN_FAQ_TEXT_LENGTH = 10;

  const resetFAQEntryForm = () => {
    setFaqEntryForm({ id: '', question: '', answer: '', imageUrl: '', videoUrl: '' });
    setFaqEntryFeedback(null);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      id: '',
      date: '',
      category: '',
      priority: 'medium',
      title: '',
      description: '',
      details: '',
    });
  };

  const formatDate = (value: string) => formatDateFull(value);

  const openConfirmDialog = (
    title: string,
    description: string,
    onConfirm: () => void | Promise<void>,
  ) => {
    setConfirmState({
      open: true,
      title,
      description,
      onConfirm,
    });
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
  };

  const handleSaveHome = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!homeForm.heroTitle.trim() || !homeForm.heroSubtitle.trim()) {
      showFeedback('error', 'Preencha pelo menos o título e o subtítulo principais da home.');
      return;
    }

    updateHomeContent(homeForm);
    setIsHomeDirty(false);
    showFeedback('success', 'Conteúdo da home atualizado com sucesso.');
  };

  const handleSaveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCategory) {
      return;
    }

    if (!categoryForm.label.trim() || !categoryForm.description.trim()) {
      showFeedback('error', 'Informe o nome e a descrição da categoria.');
      return;
    }

    try {
      await updateFAQCategory(selectedCategory.id, {
        label: categoryForm.label.trim(),
        description: categoryForm.description.trim(),
      });
      showFeedback('success', 'Categoria atualizada com sucesso.');
    } catch (error) {
      showFeedback(
        'error',
        error instanceof Error ? error.message : 'Não foi possível atualizar a categoria.',
      );
    }
  };

  const handleSaveFAQEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFaqEntryFeedback(null);

    if (!selectedCategory) {
      setFaqEntryFeedback('Selecione uma categoria antes de salvar a pergunta.');
      return;
    }

    const question = faqEntryForm.question.trim();
    const answer = faqEntryForm.answer.trim();

    if (!question || !answer) {
      setFaqEntryFeedback('Preencha a pergunta e a resposta.');
      return;
    }

    if (question.length < MIN_FAQ_TEXT_LENGTH || answer.length < MIN_FAQ_TEXT_LENGTH) {
      setFaqEntryFeedback(
        `A pergunta e a resposta devem ter no mínimo ${MIN_FAQ_TEXT_LENGTH} caracteres cada.`,
      );
      return;
    }

    const imageUrl = faqEntryForm.imageUrl.trim();
    const videoUrl = faqEntryForm.videoUrl.trim();

    if (!isValidImageUrl(imageUrl)) {
      setFaqEntryFeedback('Informe uma URL de imagem válida (http ou https).');
      return;
    }

    const normalizedVideoUrl = normalizeVideoUrl(videoUrl);
    if (videoUrl && !getSafeVideoUrl(normalizedVideoUrl)) {
      setFaqEntryFeedback(
        'Informe uma URL de vídeo do YouTube ou Vimeo (ex.: https://www.youtube.com/watch?v=...).',
      );
      return;
    }

    const payload = {
      question,
      answer,
      imageUrl,
      videoUrl: normalizedVideoUrl,
    };

    try {
      if (faqEntryForm.id) {
        await updateFAQEntry(selectedCategory.id, faqEntryForm.id, payload);
        showFeedback('success', 'Pergunta atualizada com sucesso.');
      } else {
        await createFAQEntry(selectedCategory.id, payload);
        showFeedback('success', 'Pergunta adicionada com sucesso.');
      }

      resetFAQEntryForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível salvar a pergunta.';
      setFaqEntryFeedback(message);
      showFeedback('error', message);
    }
  };

  const handleSaveAnnouncement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !announcementForm.title.trim() ||
      !announcementForm.description.trim()
    ) {
      showFeedback('error', 'Preencha pelo menos título e descrição do comunicado.');
      return;
    }

    const payload = {
      date: announcementForm.date,
      category: announcementForm.category.trim(),
      priority: announcementForm.priority as 'high' | 'medium' | 'low',
      title: announcementForm.title.trim(),
      description: announcementForm.description.trim(),
      details: announcementForm.details.trim(),
    };

    try {
      if (announcementForm.id) {
        await updateAnnouncement({ id: announcementForm.id, ...payload });
        showFeedback('success', 'Comunicado atualizado com sucesso.');
      } else {
        await createAnnouncement(payload);
        showFeedback('success', 'Comunicado publicado com sucesso.');
      }

      resetAnnouncementForm();
    } catch (error) {
      showFeedback(
        'error',
        error instanceof Error ? error.message : 'Não foi possível salvar o comunicado.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      <section className="bg-brand-primary px-4 pt-12 pb-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase">
                <Edit className="h-4 w-4" />
                Painel administrativo
              </div>
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">Gerenciar conteúdos</h1>
              <p className="max-w-2xl text-base leading-relaxed text-blue-100">
                Gerencie a home, as categorias do FAQ e os comunicados oficiais do UniFAQ.
              </p>
              <p className="mt-3 text-sm text-blue-200">Logado como {user?.name}</p>
            </div>

            <Button
              variant="outline"
              onClick={logout}
              className="shrink-0 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        {feedback ? (
          <div
            role="alert"
            aria-live="polite"
            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        ) : null}
        <div className="relative z-10 -mt-16 mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <p className="mb-1 text-sm text-gray-500">Página inicial</p>
            <p className="text-xl font-bold text-gray-900">{home.heroTitle}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <p className="mb-1 text-sm text-gray-500">Perguntas cadastradas</p>
            <p className="text-3xl font-bold text-[#004581]">{totalFAQEntries}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <p className="mb-1 text-sm text-gray-500">Comunicados publicados</p>
            <p className="text-3xl font-bold text-[#004581]">{announcements.length}</p>
          </div>
        </div>

        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-4 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#004581]" />
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">Importante:</strong> este painel usa a mesma fonte de
            dados das páginas públicas e salva as alterações no{' '}
            <strong>localStorage do navegador</strong>. O conteúdo alterado aqui já reflete na{' '}
            <strong>página inicial</strong>, em <strong>/faq</strong> e em{' '}
            <strong>/comunicados</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] md:p-6">
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-xl bg-gray-100 p-2 md:grid-cols-3">
            <TabsTrigger
              value="home"
              className="rounded-lg py-3 data-[state=active]:bg-[#004581] data-[state=active]:text-white"
            >
              <LayoutPanelTop className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="rounded-lg py-3 data-[state=active]:bg-[#004581] data-[state=active]:text-white"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="rounded-lg py-3 data-[state=active]:bg-[#004581] data-[state=active]:text-white"
            >
              <Megaphone className="h-4 w-4" />
              Comunicados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
              <CardHeader>
                <CardTitle>Gerenciar conteúdos da home</CardTitle>
                <CardDescription>
                  Atualize os textos principais exibidos na página inicial sem alterar a estrutura
                  pública.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveHome} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Título principal</Label>
                    <Input
                      id="heroTitle"
                      value={homeForm.heroTitle}
                      onChange={(event) =>
                        setHomeForm((current) => {
                          setIsHomeDirty(true);
                          return { ...current, heroTitle: event.target.value };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faqSectionTitle">Título da seção de FAQ</Label>
                    <Input
                      id="faqSectionTitle"
                      value={homeForm.faqSectionTitle}
                      onChange={(event) =>
                        setHomeForm((current) => {
                          setIsHomeDirty(true);
                          return {
                            ...current,
                            faqSectionTitle: event.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="heroSubtitle">Subtítulo principal</Label>
                    <Textarea
                      id="heroSubtitle"
                      rows={3}
                      value={homeForm.heroSubtitle}
                      onChange={(event) =>
                        setHomeForm((current) => {
                          setIsHomeDirty(true);
                          return { ...current, heroSubtitle: event.target.value };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuredTitle">Título do destaque</Label>
                    <Input
                      id="featuredTitle"
                      value={homeForm.featuredTitle}
                      onChange={(event) =>
                        setHomeForm((current) => {
                          setIsHomeDirty(true);
                          return {
                            ...current,
                            featuredTitle: event.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcementsSectionTitle">Título dos comunicados</Label>
                    <Input
                      id="announcementsSectionTitle"
                      value={homeForm.announcementsSectionTitle}
                      onChange={(event) =>
                        setHomeForm((current) => {
                          setIsHomeDirty(true);
                          return {
                            ...current,
                            announcementsSectionTitle: event.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="featuredDescription">Descrição do destaque</Label>
                    <Textarea
                      id="featuredDescription"
                      rows={4}
                      value={homeForm.featuredDescription}
                      onChange={(event) =>
                        setHomeForm((current) => {
                          setIsHomeDirty(true);
                          return {
                            ...current,
                            featuredDescription: event.target.value,
                          };
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex justify-end md:col-span-2">
                    <Button
                      type="submit"
                      className="bg-[#FF8C00] text-white hover:bg-[#e67e00]"
                    >
                      <Save className="h-4 w-4" />
                      Salvar home
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
                <CardHeader>
                  <CardTitle>Categorias do FAQ</CardTitle>
                  <CardDescription>
                    Selecione uma categoria para editar descrição e perguntas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                        selectedCategoryId === category.id
                          ? 'border-[#004581] bg-blue-50 text-[#004581]'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm opacity-80">{category.items.length} pergunta(s)</div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
                  <CardHeader>
                    <CardTitle>Metadados da categoria</CardTitle>
                    <CardDescription>
                      Atualize o nome e a descrição exibidos no FAQ público e na home.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveCategory} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryLabel">Nome da categoria</Label>
                        <Input
                          id="categoryLabel"
                          value={categoryForm.label}
                          onChange={(event) =>
                            setCategoryForm((current) => ({
                              ...current,
                              label: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryDescription">Descrição</Label>
                        <Textarea
                          id="categoryDescription"
                          rows={3}
                          value={categoryForm.description}
                          onChange={(event) =>
                            setCategoryForm((current) => ({
                              ...current,
                              description: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#FF8C00] text-white hover:bg-[#e67e00]"
                        >
                          <Save className="h-4 w-4" />
                          Salvar categoria
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
                    <CardHeader>
                      <CardTitle>
                        {faqEntryForm.id ? 'Editar pergunta' : 'Adicionar pergunta'}
                      </CardTitle>
                      <CardDescription>
                        Gerencie as perguntas e respostas da categoria selecionada.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveFAQEntry} noValidate className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="faqQuestion">
                            Pergunta <span className="text-gray-400">(mín. 10 caracteres)</span>
                          </Label>
                          <Input
                            id="faqQuestion"
                            value={faqEntryForm.question}
                            onChange={(event) =>
                              setFaqEntryForm((current) => ({
                                ...current,
                                question: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faqAnswer">
                            Resposta <span className="text-gray-400">(mín. 10 caracteres)</span>
                          </Label>
                          <Textarea
                            id="faqAnswer"
                            rows={5}
                            value={faqEntryForm.answer}
                            onChange={(event) =>
                              setFaqEntryForm((current) => ({
                                ...current,
                                answer: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faqVideo" className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            URL do vídeo <span className="text-gray-400">(YouTube ou Vimeo)</span>
                          </Label>
                          <Input
                            id="faqVideo"
                            type="text"
                            value={faqEntryForm.videoUrl}
                            onChange={(event) =>
                              setFaqEntryForm((current) => ({
                                ...current,
                                videoUrl: event.target.value,
                              }))
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faqImage" className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            URL da imagem
                          </Label>
                          <Input
                            id="faqImage"
                            type="text"
                            value={faqEntryForm.imageUrl}
                            onChange={(event) =>
                              setFaqEntryForm((current) => ({
                                ...current,
                                imageUrl: event.target.value,
                              }))
                            }
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </div>
                        {faqEntryFeedback ? (
                          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {faqEntryFeedback}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-3">
                          <Button type="submit" className="flex-1 bg-[#FF8C00] text-white hover:bg-[#e67e00]">
                            <Save className="h-4 w-4" />
                            {faqEntryForm.id ? 'Salvar pergunta' : 'Adicionar pergunta'}
                          </Button>
                          {faqEntryForm.id ? (
                            <Button type="button" variant="outline" onClick={resetFAQEntryForm}>
                              Cancelar edição
                            </Button>
                          ) : null}
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
                    <CardHeader>
                      <CardTitle>Perguntas publicadas</CardTitle>
                      <CardDescription>
                        Lista de itens atualmente exibidos em {selectedCategory?.label}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-[560px] space-y-3 overflow-y-auto">
                        {selectedCategory?.items.length ? (
                          selectedCategory.items.map((item) => (
                            <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-4">
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <h3 className="font-medium text-gray-900">{item.question}</h3>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    aria-label={`Editar pergunta: ${item.question}`}
                                    onClick={() =>
                                      setFaqEntryForm({
                                        id: item.id,
                                        question: item.question,
                                        answer: item.answer,
                                        imageUrl: item.imageUrl,
                                        videoUrl: item.videoUrl,
                                      })
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    aria-label={`Excluir pergunta: ${item.question}`}
                                    onClick={() => {
                                      if (!selectedCategory) {
                                        return;
                                      }

                                      openConfirmDialog(
                                        'Excluir pergunta',
                                        'Esta ação remove a pergunta da categoria e não pode ser desfeita.',
                                        async () => {
                                          try {
                                            await deleteFAQEntry(selectedCategory.id, item.id);
                                            showFeedback('success', 'Pergunta removida com sucesso.');
                                          } catch (error) {
                                            showFeedback(
                                              'error',
                                              error instanceof Error
                                                ? error.message
                                                : 'Não foi possível remover a pergunta.',
                                            );
                                          }
                                        },
                                      );
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{item.answer}</p>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-gray-500">
                            Nenhuma pergunta cadastrada nesta categoria.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
                <CardHeader>
                  <CardTitle>
                    {announcementForm.id ? 'Editar comunicado' : 'Novo comunicado'}
                  </CardTitle>
                  <CardDescription>
                    Cadastre publicações oficiais que aparecerão automaticamente na página pública.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="announcementDate">Data</Label>
                        <Input
                          id="announcementDate"
                          type="date"
                          value={announcementForm.date}
                          onChange={(event) =>
                            setAnnouncementForm((current) => ({
                              ...current,
                              date: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="announcementCategory">Categoria</Label>
                        <Input
                          id="announcementCategory"
                          value={announcementForm.category}
                          onChange={(event) =>
                            setAnnouncementForm((current) => ({
                              ...current,
                              category: event.target.value,
                            }))
                          }
                          placeholder="Calendário, Evento, Sistema..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="announcementPriority">Prioridade</Label>
                        <Select
                          value={announcementForm.priority}
                          onValueChange={(value) =>
                            setAnnouncementForm((current) => ({
                              ...current,
                              priority: value,
                            }))
                          }
                        >
                          <SelectTrigger id="announcementPriority">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">{ANNOUNCEMENT_PRIORITY_LABELS.high}</SelectItem>
                            <SelectItem value="medium">
                              {ANNOUNCEMENT_PRIORITY_LABELS.medium}
                            </SelectItem>
                            <SelectItem value="low">{ANNOUNCEMENT_PRIORITY_LABELS.low}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcementTitle">Título</Label>
                      <Input
                        id="announcementTitle"
                        value={announcementForm.title}
                        onChange={(event) =>
                          setAnnouncementForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcementDescription">Descrição curta</Label>
                      <Textarea
                        id="announcementDescription"
                        rows={3}
                        value={announcementForm.description}
                        onChange={(event) =>
                          setAnnouncementForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcementDetails">Conteúdo detalhado</Label>
                      <Textarea
                        id="announcementDetails"
                        rows={6}
                        value={announcementForm.details}
                        onChange={(event) =>
                          setAnnouncementForm((current) => ({
                            ...current,
                            details: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" className="flex-1 bg-[#FF8C00] text-white hover:bg-[#e67e00]">
                        <Save className="h-4 w-4" />
                        {announcementForm.id ? 'Salvar comunicado' : 'Publicar comunicado'}
                      </Button>
                      {announcementForm.id ? (
                        <Button type="button" variant="outline" onClick={resetAnnouncementForm}>
                          Cancelar edição
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-gray-100 bg-gray-50 shadow-none">
                <CardHeader>
                  <CardTitle>Comunicados existentes</CardTitle>
                  <CardDescription>
                    Todos os itens abaixo já refletem diretamente na página pública.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[650px] space-y-3 overflow-y-auto">
                    {sortedAnnouncements.length ? (
                      sortedAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="rounded-xl border border-gray-100 bg-white p-4">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                {formatDate(announcement.date)} · {announcement.category}
                              </p>
                              <h3 className="mt-1 font-medium text-gray-900">
                                {announcement.title}
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                aria-label={`Editar comunicado: ${announcement.title}`}
                                onClick={() =>
                                  setAnnouncementForm({
                                    id: announcement.id,
                                    date: announcement.date,
                                    category: announcement.category,
                                    priority: announcement.priority,
                                    title: announcement.title,
                                    description: announcement.description,
                                    details: announcement.details,
                                  })
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                aria-label={`Excluir comunicado: ${announcement.title}`}
                                onClick={() => {
                                  openConfirmDialog(
                                    'Excluir comunicado',
                                    'Esta ação remove o comunicado publicado e não pode ser desfeita.',
                                    async () => {
                                      try {
                                        await deleteAnnouncement(announcement.id);
                                        showFeedback('success', 'Comunicado removido com sucesso.');
                                      } catch (error) {
                                        showFeedback(
                                          'error',
                                          error instanceof Error
                                            ? error.message
                                            : 'Não foi possível remover o comunicado.',
                                        );
                                      }
                                    },
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{announcement.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-gray-500">
                        Nenhum comunicado cadastrado.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
          <AlertDialog
            open={confirmState.open}
            onOpenChange={(open) => setConfirmState((current) => ({ ...current, open }))}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmState.title}</AlertDialogTitle>
                <AlertDialogDescription>{confirmState.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await confirmState.onConfirm?.();
                    setConfirmState((current) => ({ ...current, open: false, onConfirm: undefined }));
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
