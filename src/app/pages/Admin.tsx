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
import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';

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

  const selectedCategory = useMemo(
    () => faqCategories.find((category) => category.id === selectedCategoryId) ?? faqCategories[0],
    [faqCategories, selectedCategoryId],
  );

  const totalFAQEntries = faqCategories.reduce((total, category) => total + category.items.length, 0);
  const sortedAnnouncements = [...announcements].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  useEffect(() => {
    setHomeForm(home);
  }, [home]);

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
    resetFAQEntryForm();
  }, [selectedCategory]);

  const resetFAQEntryForm = () => {
    setFaqEntryForm({ id: '', question: '', answer: '', imageUrl: '', videoUrl: '' });
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

  const formatDate = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR');

  const handleSaveHome = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!homeForm.heroTitle.trim() || !homeForm.heroSubtitle.trim()) {
      window.alert('Preencha pelo menos o título e o subtítulo principais da home.');
      return;
    }

    updateHomeContent(homeForm);
    window.alert('Conteúdo da home atualizado com sucesso.');
  };

  const handleSaveCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCategory) {
      return;
    }

    if (!categoryForm.label.trim() || !categoryForm.description.trim()) {
      window.alert('Informe o nome e a descrição da categoria.');
      return;
    }

    updateFAQCategory(selectedCategory.id, {
      label: categoryForm.label.trim(),
      description: categoryForm.description.trim(),
    });

    window.alert('Categoria atualizada com sucesso.');
  };

  const handleSaveFAQEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCategory) {
      return;
    }

    if (!faqEntryForm.question.trim() || !faqEntryForm.answer.trim()) {
      window.alert('Preencha a pergunta e a resposta.');
      return;
    }

    const payload = {
      question: faqEntryForm.question.trim(),
      answer: faqEntryForm.answer.trim(),
      imageUrl: faqEntryForm.imageUrl.trim(),
      videoUrl: faqEntryForm.videoUrl.trim(),
    };

    if (faqEntryForm.id) {
      updateFAQEntry(selectedCategory.id, faqEntryForm.id, payload);
      window.alert('Pergunta atualizada com sucesso.');
    } else {
      createFAQEntry(selectedCategory.id, payload);
      window.alert('Pergunta adicionada com sucesso.');
    }

    resetFAQEntryForm();
  };

  const handleSaveAnnouncement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !announcementForm.date ||
      !announcementForm.category.trim() ||
      !announcementForm.title.trim() ||
      !announcementForm.description.trim() ||
      !announcementForm.details.trim()
    ) {
      window.alert('Preencha todos os campos do comunicado.');
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

    if (announcementForm.id) {
      updateAnnouncement({ id: announcementForm.id, ...payload });
      window.alert('Comunicado atualizado com sucesso.');
    } else {
      createAnnouncement(payload);
      window.alert('Comunicado publicado com sucesso.');
    }

    resetAnnouncementForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Edit className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl text-gray-900">Painel Administrativo</h1>
              </div>
              <p className="text-gray-600">
                Gerencie a home, as categorias do FAQ e os comunicados oficiais da escola.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <p className="text-sm text-gray-500">Logado como {user?.name}</p>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="text-sm text-gray-800">
              <strong>Importante:</strong> este painel agora usa a mesma fonte de dados das páginas
              públicas e salva as alterações no navegador. O conteúdo alterado aqui já reflete em
              <strong> /</strong>, <strong>/faq</strong> e <strong>/comunicados</strong>.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Página inicial</CardDescription>
              <CardTitle>{home.heroTitle}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Perguntas cadastradas</CardDescription>
              <CardTitle>{totalFAQEntries}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Comunicados publicados</CardDescription>
              <CardTitle>{announcements.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 md:grid-cols-3">
            <TabsTrigger value="home" className="py-3">
              <LayoutPanelTop className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="faq" className="py-3">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="announcements" className="py-3">
              <Megaphone className="h-4 w-4" />
              Comunicados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
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
                        setHomeForm((current) => ({ ...current, heroTitle: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faqSectionTitle">Título da seção de FAQ</Label>
                    <Input
                      id="faqSectionTitle"
                      value={homeForm.faqSectionTitle}
                      onChange={(event) =>
                        setHomeForm((current) => ({
                          ...current,
                          faqSectionTitle: event.target.value,
                        }))
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
                        setHomeForm((current) => ({ ...current, heroSubtitle: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuredTitle">Título do destaque</Label>
                    <Input
                      id="featuredTitle"
                      value={homeForm.featuredTitle}
                      onChange={(event) =>
                        setHomeForm((current) => ({
                          ...current,
                          featuredTitle: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcementsSectionTitle">Título dos comunicados</Label>
                    <Input
                      id="announcementsSectionTitle"
                      value={homeForm.announcementsSectionTitle}
                      onChange={(event) =>
                        setHomeForm((current) => ({
                          ...current,
                          announcementsSectionTitle: event.target.value,
                        }))
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
                        setHomeForm((current) => ({
                          ...current,
                          featuredDescription: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chatbotTitle">Título do CTA do chatbot</Label>
                    <Input
                      id="chatbotTitle"
                      value={homeForm.chatbotTitle}
                      onChange={(event) =>
                        setHomeForm((current) => ({ ...current, chatbotTitle: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chatbotButtonLabel">Texto do botão</Label>
                    <Input
                      id="chatbotButtonLabel"
                      value={homeForm.chatbotButtonLabel}
                      onChange={(event) =>
                        setHomeForm((current) => ({
                          ...current,
                          chatbotButtonLabel: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="chatbotDescription">Descrição do CTA do chatbot</Label>
                    <Textarea
                      id="chatbotDescription"
                      rows={3}
                      value={homeForm.chatbotDescription}
                      onChange={(event) =>
                        setHomeForm((current) => ({
                          ...current,
                          chatbotDescription: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end md:col-span-2">
                    <Button type="submit">
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
              <Card>
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
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
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
                <Card>
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
                        <Button type="submit">
                          <Save className="h-4 w-4" />
                          Salvar categoria
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {faqEntryForm.id ? 'Editar pergunta' : 'Adicionar pergunta'}
                      </CardTitle>
                      <CardDescription>
                        Gerencie as perguntas e respostas da categoria selecionada.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveFAQEntry} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="faqQuestion">Pergunta</Label>
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
                          <Label htmlFor="faqAnswer">Resposta</Label>
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
                            URL do vídeo
                          </Label>
                          <Input
                            id="faqVideo"
                            type="url"
                            value={faqEntryForm.videoUrl}
                            onChange={(event) =>
                              setFaqEntryForm((current) => ({
                                ...current,
                                videoUrl: event.target.value,
                              }))
                            }
                            placeholder="https://www.youtube.com/embed/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faqImage" className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            URL da imagem
                          </Label>
                          <Input
                            id="faqImage"
                            type="url"
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
                        <div className="flex flex-wrap gap-3">
                          <Button type="submit" className="flex-1">
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

                  <Card>
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
                            <div key={item.id} className="rounded-lg border p-4">
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <h3 className="font-medium text-gray-900">{item.question}</h3>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
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
                                    onClick={() => {
                                      if (
                                        selectedCategory &&
                                        window.confirm('Deseja excluir esta pergunta?')
                                      ) {
                                        deleteFAQEntry(selectedCategory.id, item.id);
                                      }
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
                          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-gray-500">
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
              <Card>
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
                            <SelectItem value="high">Urgente</SelectItem>
                            <SelectItem value="medium">Importante</SelectItem>
                            <SelectItem value="low">Informativo</SelectItem>
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
                      <Button type="submit" className="flex-1">
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

              <Card>
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
                        <div key={announcement.id} className="rounded-lg border p-4">
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
                                onClick={() => {
                                  if (window.confirm('Deseja excluir este comunicado?')) {
                                    deleteAnnouncement(announcement.id);
                                  }
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
                      <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-gray-500">
                        Nenhum comunicado cadastrado.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
