import { useState } from 'react';
import { Plus, Save, Trash2, Edit, Image, Video, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  videoUrl?: string;
  imageUrl?: string;
}

export function Admin() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: 1,
      question: 'Quais documentos são necessários para matrícula?',
      answer: 'RG, CPF, comprovante de residência e histórico escolar.',
      category: 'Matrícula',
    },
    {
      id: 2,
      question: 'Qual o horário de funcionamento?',
      answer: 'Segunda a sexta das 7h às 22h, sábados das 8h às 12h.',
      category: 'Horários',
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    videoUrl: '',
    imageUrl: '',
  });

  const categories = ['Matrícula', 'Horários', 'Financeiro', 'Calendário', 'Geral'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.answer || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingId) {
      // Atualizar item existente
      setFaqItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...formData }
            : item
        )
      );
      setEditingId(null);
    } else {
      // Adicionar novo item
      const newItem: FAQItem = {
        id: Date.now(),
        ...formData,
      };
      setFaqItems((prev) => [...prev, newItem]);
    }

    // Limpar formulário
    setFormData({
      question: '',
      answer: '',
      category: '',
      videoUrl: '',
      imageUrl: '',
    });
  };

  const handleEdit = (item: FAQItem) => {
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      videoUrl: item.videoUrl || '',
      imageUrl: item.imageUrl || '',
    });
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      setFaqItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: '',
      videoUrl: '',
      imageUrl: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Edit className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl text-gray-900">Painel Administrativo</h1>
          </div>
          <p className="text-gray-600">Gerencie perguntas frequentes e conteúdo do FAQ</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Alert */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-800">
              <strong>Importante:</strong> Esta é uma interface de demonstração. As informações
              publicadas devem ser de responsabilidade do administrador. Não inclua dados sensíveis
              ou informações confidenciais.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingId ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}
              </CardTitle>
              <CardDescription>
                Preencha os campos abaixo para adicionar ou editar uma pergunta do FAQ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Categoria */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pergunta */}
                <div className="space-y-2">
                  <Label htmlFor="question">Pergunta *</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Digite a pergunta..."
                    required
                  />
                </div>

                {/* Resposta */}
                <div className="space-y-2">
                  <Label htmlFor="answer">Resposta *</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Digite a resposta..."
                    rows={4}
                    required
                  />
                </div>

                {/* URL do Vídeo */}
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    URL do Vídeo (YouTube)
                  </Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <p className="text-xs text-gray-500">Opcional - Cole o link de incorporação do YouTube</p>
                </div>

                {/* URL da Imagem */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    URL da Imagem
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-gray-500">Opcional - Cole o link de uma imagem</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Salvar Alterações' : 'Adicionar Pergunta'}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Cadastradas ({faqItems.length})</CardTitle>
                <CardDescription>Lista de todas as perguntas do FAQ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {faqItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma pergunta cadastrada</p>
                  ) : (
                    faqItems.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {item.category}
                            </span>
                            <h4 className="font-medium text-gray-900 mt-2">{item.question}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.answer}</p>
                        {(item.videoUrl || item.imageUrl) && (
                          <div className="flex gap-2 mt-2">
                            {item.videoUrl && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Video className="w-3 h-3" /> Vídeo
                              </span>
                            )}
                            {item.imageUrl && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Image className="w-3 h-3" /> Imagem
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
